export default function getErrorMessage(error: any): string {
    let value = '';
    if (error?.response?.data?.error?.fields) {
        const key = Object.keys(error.response.data.error.fields)[0];
        value = error.response.data.error.fields[key];
    }
    let message = error?.response?.data?.error?.message ?? value
    return message ? message : "Something went wrong";
}