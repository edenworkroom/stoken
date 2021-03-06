const plus = null;

class LocalStorage {

    constructor() {
    }

    get(key) {
        let data = window.localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
    }

    key(index) {
        return window.localStorage.key(index);
    }

    delete(key) {
        window.localStorage.removeItem(key);
    }

    set(key, value) {
        if (value) {
            window.localStorage.setItem(key, JSON.stringify(value))
        }
    }

    has(key) {
        let data = window.localStorage.getItem(key);
        return !!data;
    }
}

class LinkedListStorage {

    constructor(prefix, db) {
        this.db = db;
        this.prefix = prefix;
        this.headKey = this.genKey("headkey");
        this.tailKey = this.genKey("tailKey");
    }

    genKey(key) {
        return this.prefix + ":" + key;
    }

    forEach(func) {
        let key = this.db.get(this.tailKey);
        if (!key) {
            return;
        }
        while (true) {
            let item = this.db.get(key);
            if (!item) {
                return
            }

            if (func(item.value, key.substring(key.lastIndexOf(":") + 1))) {
                break;
            }
            if (!item.prevKey) {
                break;
            }
            key = item.prevKey;
        }
    }

    insert(key, value) {
        key = this.genKey(key);
        let item = this.db.get(key)
        if (item) {
            item.value = value;
            this.db.set(key, item);
            return;
        } else {
            item = {value: value};
        }

        let headItemKey = this.db.get(this.headKey);
        if (!headItemKey) {
            this.db.set(this.tailKey, key);
        } else {
            item.nextKey = headItemKey;
            let nextItem = this.db.get(item.nextKey);
            nextItem.prevKey = key;
            this.db.set(item.nextKey, nextItem);
        }
        this.db.set(this.headKey, key);
        this.db.set(key, item);
    }

    insertList(list) {
        let that = this;
        list.forEach(function (item, index) {
            that.insert(that.genKey(item.key), item.value);
        });
    }

    remove(key) {
        key = this.genKey(key);
        let item = this._del(key);
        if (!item) {
            return;
        }

        let prevItem = this._get(item.prevKey);
        let nextItem = this._get(item.nextKey);
        if (!prevItem) {
            this._set(this.headKey, item.nextKey);
        } else {
            prevItem.nextKey = item.nextKey;
            this._set(item.prevKey, prevItem);
        }
        if (!nextItem) {
            this._set(this.tailKey, item.prevKey);
        } else {
            nextItem.prevKey = item.prevKey;
            this._set(item.nextKey, nextItem);
        }
        return item;
    }

    _get(key) {
        if (!key) {
            return;
        }
        return this.db.get(key);
    }

    _set(key, val) {
        if (!key) {
            return;
        }
        if (!val) {
            this.db.delete(key);
        } else {
            this.db.set(key, val);
        }
    }

    _del(key) {
        if (!key) {
            return;
        }
        let item = this.db.get(key);
        this.db.delete(key);
        return item;
    }

    get(key) {
        if (!key) {
            return;
        }
        key = this.genKey(key);
        let val = this.db.get(key);
        if (val) {
            return val.value;
        }
    }
}

const Storage = new LocalStorage();
export {Storage, LinkedListStorage}
