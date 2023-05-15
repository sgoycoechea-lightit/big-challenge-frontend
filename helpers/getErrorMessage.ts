export default function getErrorMessage(error: any) {
    let value = '';
    if (error?.response?.data?.error?.fields) {
        const key = Object.keys(error.response.data.error.fields)[0];
        value = error.response.data.error.fields[key];
    }
    return error?.response?.data?.error?.message ?? value;
}