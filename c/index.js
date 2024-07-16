const responses = [
    {
        key: 'When was New York founded?',
        response: '<p>New York was founded in 1624.</p>',
    },
];

class Chat {
    constructor(options) {
        this.root = options.element;
        this.message_heading_level = options.messageHeadingLevel;
        this.chat = document.createElement('div');
        this.chat.role = 'region';
        this.chat.setAttribute('aria-label', options.label);
        this.chat.classList.add('chat');
        this.messages = document.createElement('ol');
        this.messages.classList.add('messages');
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.classList.add('announcer');
        this.messenger = document.createElement('form');
        this.messenger.method = 'get';
        this.messenger.action = '';
        this.messenger.classList.add('messenger');
        this.messenger_input = document.createElement('input');
        this.messenger_input.type = 'text';
        this.messenger_input.setAttribute('aria-labelledby', 'messenger_submit');
        this.messenger_input.classList.add('messenger-input');
        this.messenger_submit = document.createElement('button');
        this.messenger_submit.id = 'messenger_submit';
        this.messenger_submit.type = 'submit';
        this.messenger_submit.innerHTML = `
            <svg role="img" aria-label="Send message" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"/>
            </svg>
        `;
        this.messenger_submit.classList.add('messenger-submit');
        this.user = options.user;
        this.ai = options.ai;
        this.chat.appendChild(this.messages);
        this.messenger.appendChild(this.messenger_input);
        this.messenger.appendChild(this.messenger_submit);
        this.chat.appendChild(this.announcer);
        this.chat.appendChild(this.messenger);
        this.root.appendChild(this.chat);
        this.messenger.addEventListener('submit', this.handle_messenger.bind(this));
    }

    handle_messenger(event) {
        event.preventDefault();
        new Promise((resolve, reject) => {
            this.messages.removeAttribute('aria-live');
            this.messages.removeAttribute('aria-atomic');
            const message = this.message('ZE', this.messenger_input.value);
            this.messages.appendChild(message);
            message.scrollIntoView({behavior: "smooth"});
            const response = responses.find((item) => {
                return item.key === this.messenger_input.value;
            });
            if (response === undefined) reject();
            resolve(response.response);
        }).then((value) => {
            this.announcer.innerHTML = `<p>CatGPT is typing</p>`;
            const message = this.message('AI', value);
            setTimeout(() => {
                this.messages.setAttribute('aria-live', 'polite');
                this.messages.setAttribute('aria-atomic', 'false');
                this.announcer.innerHTML = '';
                this.messages.appendChild(message);
                message.scrollIntoView({behavior: "smooth"});
            }, 3000);
        }).catch(() => {
            this.announcer.innerHTML = `<p>CatGPT is typing</p>`;
            const message = this.message('AI', `
                <p>Sorry, I could not understand your request. Try again.</p>
            `);
            setTimeout(() => {
                this.messages.setAttribute('aria-live', 'polite');
                this.messages.setAttribute('aria-atomic', 'false');
                this.announcer.innerHTML = '';
                this.messages.appendChild(message);
                message.scrollIntoView({behavior: "smooth"});
            }, 3000);
        });
    }

    message(from, message) {
        const li = document.createElement('li');
        li.classList.add('message');
        const sender = document.createElement(`span`);
        sender.classList.add('sender');
        const contentWrapper = document.createElement('div');
        const content = document.createElement('div');
        content.classList.add('content');
        if (from === 'AI') {
            li.classList.add('is-us');
            sender.innerHTML = this.ai;
            content.innerHTML = message;
        } else {
            li.classList.add('is-you');
            sender.innerHTML = this.user;
            content.innerHTML = `<p>${message}</p>`; 
        }
        li.appendChild(sender);
        contentWrapper.appendChild(content);
        li.appendChild(contentWrapper);
        return li;
    }
}

const chat = new Chat({
    element: document.querySelector('#root'),
    label: 'My chat',
    messageHeadingLevel: 2,
    user: 'You',
    ai: 'Bobbai'
});
