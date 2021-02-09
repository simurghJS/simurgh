const glob = ((window /* browser */ || global /* node */) as any)

glob.env = function (name: string) {
    let found = Object.entries(simurgh.config.constants).find(row => row[0] == name);
    if (!empty(found)) {
        return found[1];
    }
    return null;
}


glob.empty = object => {
    let result = false;

    if (typeof object == "undefined" || object == null) {
        return !result;
    }

    if (Array.isArray(object) && object.length == 0) {
        return !result;
    }

    if (typeof object == "string") {
        if (object.length <= 0) {
            return !result;
        }
    }

    if (typeof object == "object") {
        let arr = Object.entries(object);

        if (arr.length <= 0) {
            return !result;
        }
    }

    return result;
};

