module.exports = Uint8Array.from(
	atob('AGFzbQEAAAABBQFgAAF/AwIBAAcIAQRmdW5jAAAKBwEFAEEqDws='),
	(m) => m.charCodeAt(0)
);
