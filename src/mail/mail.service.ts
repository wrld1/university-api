import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendResetLink(to: string, link: string): Promise<void> {
    try {
      const success = await this.mailerService.sendMail({
        to,
        from: 'S-Pro academy',
        subject: 'Reset password on S-Pro university platform',
        text: 'welcome',
        html: `<b>Seems like you forgot your password, here is the link for the new one: 
        <a href="${link}">here</a>
        </b>`,
      });

      return success;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
