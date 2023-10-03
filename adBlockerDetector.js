class AdBlockerDetector {
    instance;
    interval;
    elem;
    attributes;
    startOnLoad;
    innerHTML;
    delay;
    isBlocked;
    requestTests;
    cookieExpiration;
    cookieName = 'adblocker';

    constructor(params = {}) {
        this.interval = params.interval || 100;
        this.elem = params.elem || 'div';
        this.delay = params.delay || 1;
        this.attributes = params.attributes || {class: 'textads banner-ads banner_ads ad-unit ad-zone ad-space adsbox'};
        this.innerHTML = params.innerHTML || '&nbsp;';
        this.cookieExpiration = params.cookieExpiration || 1;
        this.cookieName = params.cookieName || "adblocker";

        this.instance = params.instance !== undefined && params.instance ? this : null;
        this.startOnLoad = params.startOnLoad || this.instance === null;
        this.isBlocked = false;
        this.requestTests = params.requestTests || ['https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', 'https://google.com'];
        if (this.startOnLoad) {
            this.init();
        }
    }

    /**
     * This method create element in DOM
     *
     * @param tag string
     * @param attributes object
     */
    createElement = (tag = null, attributes = null) => {
        attributes = attributes || this.attributes;
        if (attributes.id === undefined) {
            attributes = {id: 'item-abd', ...attributes}
        }
        tag = tag || this.elem;
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key])
        });
        element.innerHTML = this.innerHTML;
        element.style.height = "1px";
        document.body.appendChild(element);
    }

    /**
     * This method try requests to urls
     */
    tryRequest = () => {
        this.req()
            .then((r) => {
                const index = r.indexOf(true);
                this.isBlocked = index !== -1;
                if (this.isBlocked) {
                    console.log('AdBlocker detected');
                    this.setCookie(this.cookieName, 'true', this.cookieExpiration);
                } else {
                    console.log('Not detected AdBlocker');
                }
            });
    }

    /**
     * This method try requests to urls
     *
     * @returns {Promise<Awaited<unknown>[]|boolean>}
     */
    async req() {
        if (!Array.isArray(this.requestTests) || this.requestTests.length === 0) {
            return false;
        }

        let reqs = [];

        try {
            this.requestTests.forEach((url) => {
                reqs.push(
                    fetch(
                        new Request(url, {
                            method: 'HEAD',
                            mode: 'no-cors'
                        })
                    )
                        .then((r) => {
                            console.debug(r);
                            return false;
                        })
                        .catch((e) => {
                            console.debug(e);
                            return true;
                        }));
            });

            return await Promise.all(reqs);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * This method init AdBlockerDetector
     */
    init = () => {
        setTimeout(() => {
            this.createElement();
            if (this.requestTests.length > 0) {
                this.tryRequest();
            }
        }, this.delay);
    }

    /**
     * This method start AdBlockerDetector from instance
     */
    start() {
        this.createElement();
        if (this.requestTests.length > 0) {
            this.tryRequest();
        }
    }

    /**
     * This method set cookie
     *
     * @param name string
     * @param value string
     * @param expiration int
     */
    setCookie(name, value, expiration) {
        const date = new Date();
        date.setTime(date.getTime() + (expiration * 24 * 60 * 60 * 1000));
        const expire = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expire + ";path=/";
    }
}
