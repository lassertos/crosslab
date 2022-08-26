import { generateKeyPair, exportJWK, JWK } from "jose"
import { AppDataSource } from "../data_source"
import { UserModel, KeyModel } from "../model"
import dns from "dns"
import { UserType } from "../generated/types"
import { DNSResolveError, MalformedAllowlistEntryError, MissingEntityError } from "../types/errors"

/**
 * This function tries to resolve an entry of the allowlist.
 * @param entry Entry of the allowlist ("url":username") to be resolved.
 * @returns Resolved entry in the form "ip:username"
 */
export async function resolveAllowlistEntry(entry: string): Promise<[string, string]> {
    console.log(`resolveAllowlistEntry called for "${entry}"`)
    const userRepository = AppDataSource.getRepository(UserModel)

    let url: string = ""
    let username: string = ""

    // Split provided entry into its url and username components
    if (entry.includes(":")) {
        const split = entry.split(":")
        if (split.length === 2) {
            [url, username] = split
        } else {
            throw new MalformedAllowlistEntryError(`Allowlist entry "${entry}" does not conform to format "url:username"`)
        }
    }
    if (!url) throw new MalformedAllowlistEntryError(`Could not extract url from entry`)
    if (!username) throw new MalformedAllowlistEntryError(`Could not extract username from allowlist entry`)

    // Resolve the ip of the provided url
    const ip = await new Promise<string>((res) => {
        dns.resolve4(url, (err, addresses) => {
            if (err) res("")
            res(addresses[0])
        })
    })
    if (!ip) throw new DNSResolveError(`Could not resolve ip for "${url}"`)

    // Search the user with the provided username
    const user = await userRepository.findOne({
        where: {
            username: username
        },
        relations: {
            roles: {
                scopes: true
            }
        }
    })
    if (!user) throw new MissingEntityError(`Could not find user ${username}`)

    console.log(`resolveAllowlistEntry succeeded`)

    return [ip, user.username]
}

/**
 * This function generates a new key.
 * @param usage The usage of the key (default: "sig")
 * @returns The newly generated key.
 */
export async function generateNewKey(usage: string = "sig"): Promise<KeyModel> {
    const keyRepository = AppDataSource.getRepository(KeyModel)
    const keyPair = await generateKeyPair("RS256")
    const key = keyRepository.create()

    key.private_key = JSON.stringify(await exportJWK(keyPair.privateKey))
    key.public_key = JSON.stringify(await exportJWK(keyPair.publicKey))
    key.use = usage
    key.alg = "RS256"
    await keyRepository.save(key)

    return key;
}

/**
 * This function parses a JWK from the provided key.
 * @param key The key to be parsed.
 * @returns The parsed JWK.
 */
export function jwk(key: KeyModel) {
    const jwk: JWK = JSON.parse(key.public_key);

    jwk.use = key.use;
    jwk.alg = key.alg;
    jwk.kid = key.uuid;

    return jwk;
}

/**
 * This function checks if an object is UserType.
 * @param object The object to be checked.
 * @returns True if the object is Usertype, else false.
 */
export function isUserType(object: any): object is UserType {
    if (typeof object !== "object") return false
    if (!object.url) return false
    if (typeof object.url !== "string") return false
    if (!object.username) return false
    if (typeof object.username !== "string") return false
    if (!object.scopes) return false
    if (!Array.isArray(object.scopes)) return false
    if ((object.scopes as any[]).findIndex(s => typeof s !== "string") !== -1) return false
    return typeof object === "object" && object.url && typeof object.url === "string" && object.username && typeof object.username === "string"
}