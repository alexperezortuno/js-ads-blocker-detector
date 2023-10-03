/**
 *

document.addEventListener('DOMContentLoaded', () => {
    const abd = new AdBlockerDetector({
        instance: true,
        requestTests: [
            'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
            'https://td.doubleclick.net/td/rul/1028889241',
        ],
    });
    abd.start();
});
*/
document.addEventListener('DOMContentLoaded', () => {
    const abd = new AdBlockerDetector();
});
