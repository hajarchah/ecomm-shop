import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '../../data-access/contact.service';
import { MessageService } from 'primeng/api';
import { Contact } from '../../model/contact.model';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {
  contactForm!: FormGroup;
  submitted = false;
  loading = false;
  maxMessageLength = 300; // Set the maximum message length

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private messageService: MessageService
  ) {
    this.createForm();
  }

  createForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''], // Not required based on instructions
      message: ['', [
        Validators.required, 
        Validators.maxLength(this.maxMessageLength)
      ]]
    });
  }

  get f() { 
    return this.contactForm.controls; 
  }

  // Get remaining characters for message
  get remainingChars(): number {
    const messageControl = this.contactForm.get('message');
    if (!messageControl || !messageControl.value) {
      return this.maxMessageLength;
    }
    return this.maxMessageLength - messageControl.value.length;
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.contactForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    this.contactService.createMessage(this.contactForm.value)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Message Sent',
            detail: 'Demande de contact envoyée avec succès.'
          });
          this.contactForm.reset();
          this.submitted = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to send message. Please try again later.'
          });
          this.loading = false;
        }
      });
  }
}