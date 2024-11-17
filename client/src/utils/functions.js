import { request } from "../context/AuthProvider";

export async function addToCart(pid, authToken) {
    if (pid && authToken) {
        const resp = await request('cart', 'post', { pid, authToken, route: 'add_to_cart' });
        if (resp.status == 200) {
            return resp.data.success;
        }
    }
}

export async function getCart(authToken) {
    if (authToken) {
        const resp = await request('cart', 'post', { authToken, route: 'get_cart' });
        if (resp.status == 200) {
            if (resp.data.success) {
                return resp.data.items;
            }
        }
    }
    return false;
}