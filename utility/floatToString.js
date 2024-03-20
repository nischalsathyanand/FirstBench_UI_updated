export default function floatToString(floatValue) {

    let stringValue = floatValue.toString();

    let parts = stringValue.split('.');
    
    // If there are no decimal places, return the original string
    if (parts.length === 1) {
        return stringValue;
    }

    let decimalPart = parts[1].padEnd(6, '0');

    return parts[0] + '.' + decimalPart;
}