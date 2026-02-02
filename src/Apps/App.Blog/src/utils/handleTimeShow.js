import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"

export const converteTimeToString = (time) => {
    return formatDistanceToNow(new Date(time), { addSuffix: true, locale: vi})
}

export const converterTimeToDateTime = (time) => {
    let dateTime = new Date(time);
    return `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()} ${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
}

export const converterTimeToOnlyDate = (time) => {
    let dateTime = new Date(time);
    return `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
}