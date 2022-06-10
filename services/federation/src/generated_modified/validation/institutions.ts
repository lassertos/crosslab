// tslint:disable
// @ts-nocheck
/**
 * This file was automatically generated by openapi-codegeneration.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source OpenAPI file,
 * and run openapi-codegeneration to regenerate this file.
 */
import { Institution } from "../types"
import {
    validateBodySchemaPostInstitutions,
    validateParameterSchemaInstitutionId,
    validateBodySchemaPatchInstitutionsByInstitutionId,
} from "./validation"

export function validateInputPostInstitutions(body: Institution) {
    if (body) {
        if (!validateBodySchemaPostInstitutions(body)) return false
    }

    return true
}

export function validateInputGetInstitutionsByInstitutionId(parameters: {
    institution_id: string
}) {
    if (parameters) {
        if (!validateParameterSchemaInstitutionId(parameters.institution_id))
            return false
    }

    return true
}

export function validateInputPatchInstitutionsByInstitutionId(
    parameters: {
        institution_id: string
    },
    body: Institution
) {
    if (parameters) {
        if (!validateParameterSchemaInstitutionId(parameters.institution_id))
            return false
    }

    if (body) {
        if (!validateBodySchemaPatchInstitutionsByInstitutionId(body))
            return false
    }

    return true
}

export function validateInputDeleteInstitutionsByInstitutionId(parameters: {
    institution_id: string
}) {
    if (parameters) {
        if (!validateParameterSchemaInstitutionId(parameters.institution_id))
            return false
    }

    return true
}
