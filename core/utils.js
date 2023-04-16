import { Prisma } from "@prisma/client";

export function checkBodyParams(res, params) {
    const parameters = [];
    Object.keys(params).forEach(key => {
        if (!params[key]) {
            parameters.push(key);
        }
    });
    if (parameters.length === 0) {
        return true;
    }
    res.status(400).json({
        error: true,
        message: 'Invalid parameters!',
        parameters
    });
    return false;
}

export function checkIntParam(res, param, message, check = {}) {
    const id = parseInt(param, 10);
    if (isNaN(id)) {
        res.status(400).json({
            error: true,
            message
        });
        return null;
    }
    if (check.gt !== undefined && id <= check.gt) {
        res.status(400).json({
            error: true,
            message
        });
        return null;
    }
    if (check.lt !== undefined && id >= check.lt) {
        res.status(400).json({
            error: true,
            message
        });
        return null;
    }
    return id;
}

export function getIntParam(param, def, check = {}) {
    const id = parseInt(param, 10);
    if (isNaN(id)) {
        return def;
    }
    if (check.gt !== undefined && id <= check.gt) {
        return def;
    }
    if (check.lt !== undefined && id >= check.lt) {
        return def;
    }
    return id;
}

export function handleError(res, e) {
    return res.status(500).json({ error: true, message: 'Internal server error!' });
}

export function handleUpdateError(res, e, message) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
            return res.status(400).json({
                error: true,
                message
            });
        }
    }
    return handleError(res, e);
}
