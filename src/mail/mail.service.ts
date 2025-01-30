import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mailgun from 'mailgun-js';
import { IMailGunData } from './interfaces/mail.interface';

@Injectable()
export class MailService {
  private mg: Mailgun.Mailgun;

  constructor(private readonly configService: ConfigService) {
    const mgApiKey = this.configService.get<string>('MAILGUN_API_KEY');
    const mgDomain = this.configService.get<string>('MAILGUN_API_DOMAIN');

    if (!mgApiKey) {
      throw new Error(
        'MAILGUN_API_KEY is not defined in the environment variables.',
      );
    }
    if (!mgDomain) {
      throw new Error(
        'MAILGUN_DOMAIN is not defined in the environment variables.',
      );
    }

    this.mg = new Mailgun({
      apiKey: mgApiKey,
      domain: mgDomain,
    });
  }

  async send(data: IMailGunData): Promise<Mailgun.messages.SendResponse> {
    return new Promise((res, rej) => {
      this.mg.messages().send(data, (err, body) => {
        if (err) {
          return rej(err);
        }
        res(body);
      });
    });
  }
}
