const responses = [
    {
        key: 'Help me plan a holiday in Asia',
        response: `
            <p>Sure! I can help with that. To get started, please provide some more details.</p>
            <form id="form-1">
                <p>All fields are required unless otherwise indicated.</p>
                <div>
                    <label for="form-1-budget">Approximate budget</label>
                    <select id="form-1-budget" aria-required="true">
                        <option>$1000</option>
                        <option>$2000</option>
                        <option>$3000</option>
                    </select>
                </div>
                <div>
                    <label for="form-1-duration">Duration (in days)</label>
                    <input type="number" id="form-1-duration" aria-required="true">
                </div>
                <div>
                    <label for="form-1-other">Other details? (optional)<br><span class="ins">(E.g. interests, accommodation preferences, travel companions)</span></label>
                    <textarea id="form-1-other"></textarea>
                </div>
                <div class="controls">
                    <button class="tert">Cancel</button>
                    <button class="prim" type="submit">Submit</button>
                </div>
            </form>
        `,
    },
    {
        key: 'Can you give me a more detailed itinerary for Thailand?',
        response: `
            <p>Sure! Here\'s a detailed 10-day itinerary for Thailand, balancing beach relaxation and wildlife adventure within your budget:</p>
            <h3>Thailand 10-day itinerary</h3>
            <span class="bold">Itinerary suggestions:</span>
            <ul class="highlights">
                <li><span class="bold">Day 1–4:</span> Enjoy the beaches and nightlife in Phuket. Visit Phi Phi Islands on a day trip.</li>
                <li><span class="bold">Days 5–10:</span> Travel to Khao Sok. Stay in a jungle lodge, go on a jungle trek, and take a boat tour on Cheow Lan Lake.</li>
            </ul>
            <span class="bold">Budget breakdown:</span>
            <ul class="highlights">
                <li>
                    <span class="bold">Flights:</span> Approximately $800–$1000 (Book in advance for the best deals)
                    <ul>
                        <li><a href="#">Skyscanner - Find cheap flights</a></li>
                    </ul>
                </li>
                <li>
                    <span class="bold">Accommodation:</span> $50–$70 per night, total $250–$350
                    <ul>
                        <li><a href="#">Booking.com</a></li>
                    </ul>
                </li>
                <li>
                    <span class="bold">Food & Activites:</span> $20–$30 per day, total $100-$150
                </li>
                <li>
                    <span class="bold">Transporation & Miscellaneous:</span> $100-$150
                    <ul>
                        <li><a href="#">12Go Asia</a></li>
                    </ul>
                </li>
            </ul>
            <p>Let me know if you need any more details or specific recommendations! Enjoy your holiday planning!</p>
        `,
    },
    {
        key: 'Thanks! Can you help me decide on the specific activities?',
        response: `
            <p>Sure! To help us tailor your itinerary, please specify which acitivites you would prefer for your wildlife and beach holiday?</p>
            <form id="form-2">
                <p>All fields are required unless otherwise indicated.</p>
                <fieldset>
                    <legend>Activities (optional)</legend>
                    <ul>
                        <li>
                            <input type="checkbox" id="form-2-cb1"><label for="form-2-cb1">Snorkeling and diving with marine life</label>
                        </li>
                        <li>
                            <input type="checkbox" id="form-2-cb2"><label for="form-2-cb2">Relaxing on the beach with occasional wildlife spotting</label>
                        </li>
                        <li>
                            <input type="checkbox" id="form-2-cb3"><label for="form-2-cb3">Guided jungle treks and wildlife safaris</label>
                        </li>
                        <li>
                            <input type="checkbox" id="form-2-cb4"><label for="form-2-cb4">Boat tours and island hopping with wildlife exploration</label>
                        </li>
                        <li>
                            <input type="checkbox" id="form-2-cb5"><label for="form-2-cb5">Birdwatching and nature walks along the coast</label>
                        </li>
                    </ul>
                </fieldset>
                <div class="controls">
                    <button class="tert">Cancel</button>
                    <button class="prim" type="submit">Submit</button>
                </div>
            </form>
        `,
    },
];

class Chat {
    constructor(options) {
        this.end = options.end;
        this.delay = options.delay;
        this.root = options.element;
        this.message_heading_level = options.messageHeadingLevel;
        this.message_response = options.messageResponse;
        this.chat = document.createElement('div');
        this.chat.role = 'region';
        this.chat.setAttribute('aria-label', options.label);
        this.chat.classList.add('chat');
        this.messages = document.createElement('ol');
        this.messages.classList.add('messages');
        this.messenger = document.createElement('form');
        this.messenger.method = 'get';
        this.messenger.action = '';
        this.messenger.classList.add('messenger');
        this.input_container = document.createElement('div');
        this.input_container.classList.add('input-container');
        this.input_wrap = document.createElement('div');
        this.messenger_label = document.createElement('label')
        this.messenger_label.setAttribute('for', 'prompt');
        this.messenger_label.textContent = 'Enter a prompt';
        this.messenger_input = document.createElement('input');
        this.messenger_input.type = 'text';
        this.messenger_input.classList.add('messenger-input');
        this.messenger_input.id = 'prompt';
        this.messenger_input.setAttribute('aria-required', true);
        this.messenger_input.addEventListener('focus', () => {
            this.input_container.classList.add('has-focus');
        });
        this.messenger_input.addEventListener('blur', () => {
            this.input_container.classList.remove('has-focus');
        });
        this.input_error = document.createElement('span')
        this.input_error.classList.add('error');
        this.input_error.setAttribute('role', 'status');
        this.input_error.id = 'input-error';
        this.messenger_submit = document.createElement('button');
        this.messenger_submit.id = 'messenger_submit';
        this.messenger_submit.type = 'submit';
        this.messenger_submit.innerHTML = `
            <svg role="img" aria-label="Send prompt" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"/>
            </svg>
        `;
        this.messenger_submit.classList.add('messenger-submit');
        this.user = options.user;
        this.ai = options.ai;
        this.announcer = document.createElement('div');
        this.announcer.classList.add('vh');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.st_last_message = document.createElement('a');
        this.st_last_message.classList.add('skip', 'to-last-message', 'vh');
        this.st_last_message.textContent = 'Skip to last message';
        this.st_last_message.href = '#last-message';
        this.st_prompt = document.createElement('a');
        this.st_prompt.classList.add('skip', 'to-prompt', 'vh');
        this.st_prompt.textContent = 'Skip to prompt';
        this.st_prompt.href='#prompt';
        this.loading = document.createElement('p');
        this.loading.setAttribute('aria-live', 'polite')
        this.loading.setAttribute('aria-atomic', 'true');
        this.loading.classList.add('loading');
        this.chat.appendChild(this.st_prompt);
        this.chat.appendChild(this.messages);
        this.messenger.appendChild(this.loading);
        this.messenger.appendChild(this.messenger_label);
        this.input_wrap.appendChild(this.messenger_input);
        this.input_wrap.appendChild(this.messenger_submit);
        this.input_container.appendChild(this.input_wrap);
        this.messenger.appendChild(this.input_container);
        this.chat.appendChild(this.messenger);
        this.chat.appendChild(this.st_last_message);
        this.chat.appendChild(this.announcer);
        
        new Promise((resolve) => {
            this.root.appendChild(this.chat);
            resolve();
        }).then(() => {
            const message = this.message('AI',  '<p>Hello! Enter a prompt to get started.</p>');
            this.messages.appendChild(message);
            message.scrollIntoView({behavior: 'smooth'});
            this.lastMessageTag(message);
        });

        this.messenger.addEventListener('submit', this.handle_messenger.bind(this));
    }

    handle_messenger(event) {
        event.preventDefault();
        if (this.messenger_input.value === '') {
            new Promise((resolve) => {
                this.input_container.appendChild(this.input_error);
                this.input_container.classList.add('has-error');
                this.messenger_input.setAttribute('aria-labelledby', 'input-error');
                this.messenger_input.setAttribute('aria-invalid', true);
                resolve();
            }).then(() => {
                const icon = document.createElement('img');
                icon.src = '../assets/images/error.svg';
                icon.alt = 'Error: ';
                const span =  document.createElement('span');
                span.textContent = 'This is a required field';
                setTimeout(() => {
                    this.input_error.appendChild(icon);
                    this.input_error.appendChild(span);
                }, 100);
            }); 
            return;
        }
        new Promise((resolve) => {
            if (this.messenger_input.getAttribute('aria-invalid') === 'true') {
                this.input_container.classList.remove('has-error');
                this.messenger_input.removeAttribute('aria-invalid');
                this.messenger_input.removeAttribute('aria-labelledby');
                this.input_container.removeChild(this.input_error);
                this.input_error.replaceChildren();
            }
            const message = this.message('ZE', this.messenger_input.value);
            this.messages.appendChild(message);
            this.lastMessageTag(message);
            message.scrollIntoView({behavior: 'smooth'});
            const response = responses.find((item) => {
                let userInput = this.messenger_input.value.trim().toLowerCase();
                return item.key.trim().toLowerCase() === userInput;
            });
            if (response === undefined) resolve(undefined);
            resolve(response.response);
        }).then((value) => {
            this.loading.textContent = `${this.ai} is typing`;
            this.messages.setAttribute('aria-busy', true);
            setTimeout(() => {
                const message = this.message('AI', value !== undefined
                    ? value
                    : `<p>Sorry, I could not understand your request. Try again.</p>`
                );
                this.messages.appendChild(message);
                this.lastMessageTag(message);
                message.scrollIntoView({behavior: 'smooth'});
                this.loading.textContent =  '';
                this.messages.removeAttribute('aria-busy');
                this.announcement(this.message_response);
                this.form1 = document.querySelector('#form-1');
                if (this.form1) this.form1.addEventListener('submit', this.handleForm1.bind(this));
                this.form2 = document.querySelector('#form-2');
                if (this.form2) this.form2.addEventListener('submit', this.handleForm2.bind(this));
            }, this.delay);
        }).then(() => {
            this.messenger_input.value = '';
            setTimeout(() => {
                if (this.messages.scrollHeight != Math.max(this.messages.offsetHeight, this.messages.clientHeight)) {
                    this.messages.tabIndex = 0;
                }
            }, this.delay + 1000);
        });
    }

    handleForm1(event) {
        event.preventDefault();

        const f1_duration = this.form1.querySelector('#form-1-duration');

        if (f1_duration.value === '') {
            f1_duration.setAttribute('aria-invalid', true);
            const f1_duration_err = document.createElement('span');
            f1_duration_err.id = 'f1-duration-error';
            f1_duration_err.setAttribute('aria-live', 'polite');
            f1_duration_err.setAttribute('aria-atomic', true);
            f1_duration_err.classList.add('is-error');
            const icon = document.createElement('img');
            icon.src = '../assets/images/error.svg';
            icon.alt = 'Error: ';
            const span = document.createElement('span');
            span.textContent = 'This is a required field';
            f1_duration.setAttribute('aria-labelledby', 'f1-duration-error');
            f1_duration.parentNode.appendChild(f1_duration_err);
            f1_duration.focus();
            setTimeout(() => {
                f1_duration_err.appendChild(icon);
                f1_duration_err.appendChild(span);
            }, 100);
            return;
        }

        this.messenger_input.focus();
        this.form1.classList.add('is-hidden');
        this.loading.textContent = `${this.ai} is typing`;
        this.messages.setAttribute('aria-busy', true);
        setTimeout(() => {
            const message = this.message('AI', `
                <p>Great! With a budget of  $2000 and a preference for beaches and wildlife, here are some ideas to consider for a 10-day holiday.</p>
                <ol class="reqs">
                    <li>
                        <h3>Philippines (Palawan)</h3>
                        <span>Highlights:</span>
                        <ul class="highlights">
                            <li>
                                <span class="bold">Beaches:</span> El Nido, Nacpan Beach, Coron
                            </li>
                            <li>
                                <span class="bold">Wildlife:</span> Puerto Princesa Underground River, diving in Coron
                            </li>
                        </ul>
                        <p><span class="bold">Accommodation:</span> Choose budget guesthouses or beachfront hostels.</p>
                    </li>
                    <li>
                        <h3>Thailand (Phuket &amp; Khao Sok)</h3>
                        <span>Highlights:</span>
                        <ul class="highlights">
                            <li>
                                <span class="bold">Beaches:</span> Patong Beach, Kata Beach
                            </li>
                            <li>
                                <span class="bold">Wildlife:</span> Khao Sok National Park (jungle trekking, lake tours)
                            </li>
                        </ul>
                        <p><span class="bold">Accommodation:</span> Look for budget guesthouses or eco-lodges in both Phuket and Khao Sok.</p>
                    </li>
                    <li>
                        <h3>Sri Lanka</h3>
                        <span>Highlights:</span>
                        <ul class="highlights">
                            <li>
                                <span class="bold">Beaches:</span> Mirissa, Unawatuna, Hikkaduwa
                            </li>
                            <li>
                                <span class="bold">Wildlife:</span> Yala National Park, Sinharaja Forest Reserve
                            </li>
                        </ul>
                        <p><span class="bold">Accommodation:</span> Affordable questhouses and eco-lodges are plentiful in Sri Lanka.</p>
                    </li>
                </ol>
            `);
            this.messages.appendChild(message);
            this.lastMessageTag(message);
            message.scrollIntoView({behavior: 'smooth'});
            this.loading.textContent =  '';
            this.messages.removeAttribute('aria-busy');
            this.announcement(this.message_response);
        }, this.delay);
        setTimeout(() => {
            if (this.messages.scrollHeight != Math.max(this.messages.offsetHeight, this.messages.clientHeight)) {
                this.messages.tabIndex = 0;
            }
        }, this.delay + 1000);
    }

    handleForm2(event) {
        event.preventDefault();
        this.loading.textContent = `${this.ai} is typing`;
        this.messages.setAttribute('aria-busy', true);
        setTimeout(() => {
            const message = this.message('AI', this.end);
            this.messages.appendChild(message);
            this.lastMessageTag(message);
            message.scrollIntoView({behavior: 'smooth'});
            this.loading.textContent =  '';
            this.messages.removeAttribute('aria-busy');
            this.announcement(this.message_response);
        }, this.delay);
        setTimeout(() => {
            if (this.messages.scrollHeight != Math.max(this.messages.offsetHeight, this.messages.clientHeight)) {
                this.messages.tabIndex = 0;
            }
        }, this.delay + 1000);
    }


    lastMessageTag(message) {
        message.id = 'last-message';
        if (message.previousElementSibling) {
            message.previousElementSibling.removeAttribute('id');
        }
    }

    announcement(message) {
        this.announcer.innerHTML = message;
        setTimeout(() => {
            this.announcer.innerHTML = '';
        }, 300);
    }

    message(from, message) {
        const li = document.createElement('li');
        li.classList.add('message');
        const messageWrapper = document.createElement('div');
        const icon = document.createElement('img');
        icon.alt = '';
        const sender = document.createElement(`h${this.message_heading_level}`);
        sender.classList.add('sender');
        const name = document.createElement('span');
        const time = document.createElement('time');
        const when = new Date().toLocaleString().split(', ');
        when[1] = `${when[1].split(' ')[0].slice(0, -3)} ${when[1].split(' ')[1]}`;
        time.setAttribute('datetime', when.join(' '));
        time.textContent = when.join(' ');
        const content = document.createElement('div');
        content.classList.add('content');
        if (from === 'AI') {
            li.classList.add('is-us');
            name.innerHTML = this.ai;
            content.innerHTML = message;
            icon.src = '../assets/images/tr.svg';
        } else {
            li.classList.add('is-you');
            name.innerHTML = this.user;
            content.innerHTML = `<p>${message}</p>`; 
            icon.src = '../assets/images/user.svg';
        }
        sender.appendChild(icon);
        sender.appendChild(name);
        sender.appendChild(time);
        messageWrapper.appendChild(sender);
        messageWrapper.appendChild(content);
        li.appendChild(messageWrapper);
        return li;
    }
}

const chat = new Chat({
    element: document.querySelector('#root'),
    label: 'chat',
    messageHeadingLevel: 2,
    user: 'You',
    ai: 'Thomson Reuters',
    messageResponse: 'Thomson Reuters replied',
    delay: 5000,
    end: 'Thanks! Sending your final itinerary details. Please stay tuned.',
});
