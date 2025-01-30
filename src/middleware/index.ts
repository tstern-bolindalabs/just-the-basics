import { defineMiddleware } from "astro/middleware";

export const encode = (data: unknown) => {
    console.log('encode:', data);
    const dataSerialized = typeof data === 'string' ? data : JSON.stringify(data);
    return Buffer.from(dataSerialized).toString('base64');
};

export const decode = (str: string) => {
    console.log('decode:', str);
    return Buffer.from(str, 'base64').toString();
};

export const onRequest = defineMiddleware(async (context, next) => {
    console.log('headers#cookie:', context.request.headers.get('cookie'));

    if (context.cookies.has('test')) {
        const test = context.cookies.get('test', { decode });
        console.log('test:', test?.value);
        const test2 = context.cookies.get('test2', { decode });
        console.log('test2:', test2?.value);
    } else {
        const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
        context.cookies.set('test', 'test_value', { encode, path: '/', expires: tomorrow });
        context.cookies.set('test2', 'test_value_2', { encode, path: '/', expires: tomorrow });
    }

    return next();
});
