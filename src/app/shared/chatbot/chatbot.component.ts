import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent implements OnInit {

  isChatOpen = false;
  userInput = '';
  messages: any[] = [];

  step = 'askName';
  userData: any = {};

  ngOnInit() {
    this.loadChat();
  }

  // Toggle chat open/close
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;

    if (this.isChatOpen && this.messages.length === 0) {
      this.botReply('Hi 👋 What is your name?');
    }
  }

  // Send user message
  sendMessage() {
    if (!this.userInput.trim()) return;

    const input = this.userInput;

    // Push user message
    this.messages.push({ text: input, type: 'user' });

    if (this.step === 'askName') {
      this.userData.name = input;
      this.step = 'askMobile';

      this.botReply('Please enter your mobile number 📞');
    }

    else if (this.step === 'askMobile') {
      this.userData.mobile = input;
      this.step = 'done';

      this.botReply('Thanks! We will contact you soon.');

      console.log('Lead Captured:', this.userData);

      // OPTIONAL: Auto open WhatsApp after lead capture
      setTimeout(() => {
        const msg = `Hi, my name is ${this.userData.name} (${this.userData.mobile}). I am interested in your services.`;
        window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
      }, 1500);
    }

    else {
      this.handleNormalChat(input);
    }

    this.saveChat();
    this.userInput = '';
  }

  // Bot reply helper
  botReply(text: string) {
    setTimeout(() => {
      this.messages.push({ text, type: 'bot' });
      this.saveChat();
    }, 500);
  }

  // Normal chat handling
  handleNormalChat(msg: string) {
    msg = msg.toLowerCase();

    if (msg.includes('demo') || msg.includes('contact')) {
      this.botReply('Opening WhatsApp for quick support...');

      setTimeout(() => {
        window.open('https://wa.me/919876543210', '_blank');
      }, 1000);
    }

    else if (msg.includes('price')) {
      this.botReply('Our plans start from ₹999/month.');
    }

    else if (msg.includes('website')) {
      this.botReply('We create fast, modern and SEO-friendly websites.');
    }

    else {
      this.botReply('Type "demo", "price", or share your details 😊');
    }
  }

  // Save chat to local storage
  saveChat() {
    localStorage.setItem('chat_history', JSON.stringify(this.messages));
  }

  // Load chat from local storage
  loadChat() {
    const data = localStorage.getItem('chat_history');
    if (data) {
      this.messages = JSON.parse(data);
    }
  }
}