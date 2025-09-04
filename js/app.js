const throttle = (callback, delay) => {
	let isThrottled = false;
	let savedArgs = null;
	let savedContext = null;

	return function wrapper(...args) {
		if (isThrottled) {
			savedArgs = args;
			savedContext = this;
			return;
		}

		callback.apply(this, args);
		isThrottled = true;

		setTimeout(() => {
			isThrottled = false;
			if (savedContext) {
				wrapper.apply(savedContext, savedArgs);
				savedContext = null;
				savedArgs = null;
			}
		}, delay);
	};
};

const handleClicks = () => {
	document.addEventListener('click', event => {
		const chatTogglerButton = event.target.closest('[data-chat-toggle]');
		const chatCloseButton = event.target.closest('[data-chat-close]');
		const chat = document.querySelector('[data-chat]');
		const scrollContainer = document.querySelector('[data-scroll]');

		if (
			(!chatTogglerButton &&
				!event.target.closest('[data-chat]') &&
				!event.target.closest('[data-scroll-down]') ||
				chatCloseButton) && chat
		) {
			chat.classList.remove('_active');
		}

		if (chatTogglerButton && chat) {
			chat.classList.toggle('_active');
			scrollContainer.scrollTop = scrollContainer.scrollHeight;
		}

		if (event.target.closest('[data-scroll-down]')) {
			scrollContainer.scrollTop = scrollContainer.scrollHeight;
		}
	});
}

const handleScroll = () => {
	const scrollContainer = document.querySelector('[data-scroll]');

	if (!scrollContainer) return;

	const checkDistanceToBottom = () => {
		const scrollButton = document.querySelector('[data-scroll-down]');
		const scrollHeight = scrollContainer.scrollHeight;
		const scrollTop = scrollContainer.scrollTop;
		const clientHeight = scrollContainer.clientHeight;

		const pixelsFromBottom = scrollHeight - scrollTop - clientHeight;

		if (pixelsFromBottom < 100) {
			scrollButton.classList.add('_disappear');
		} else {
			scrollButton.classList.remove('_disappear');
		}
	}

	checkDistanceToBottom();

	const checkDistanceToBottomThrottled = throttle(checkDistanceToBottom, 300);

	scrollContainer.addEventListener('scroll', () => {
		checkDistanceToBottomThrottled();
	});
}

const handleFocus = () => {
	const textarea = document.querySelector('[data-textarea]')

	if (!textarea) return;

	textarea.addEventListener('focus', () => {
		if (
			window.innerWidth < 425 ||
			window.innerHeight < 500
		) {
			textarea.scrollIntoView();
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	handleClicks();
	handleScroll();
	handleFocus();
});