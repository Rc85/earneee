import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendEmail = {
  newAccount: {
    send: async (to: string, confirmationKey: string) => {
      const message = {
        to,
        from: {
          email: `noreply@earneee.com`
        },
        templateId: 'd-a15ec0306a77401bbecbaf8b67a24582',
        dynamicTemplateData: {
          confirmationKey
        },
        trackingSettings: {
          clickTracking: {
            enable: false
          }
        }
      };

      await sgMail.send(message).catch((err: any) => {
        throw err;
      });
    }
  },
  resetPassword: {
    send: async (to: string, token: string) => {
      const message = {
        to,
        from: {
          email: `noreply@earneee.com`
        },
        templateId: 'd-509b2c386f414278b334fd53198bc26f',
        dynamicTemplateData: {
          token
        },
        trackingSettings: {
          clickTracking: {
            enable: false
          }
        }
      };

      await sgMail.send(message).catch((err: any) => {
        throw err;
      });
    }
  }
};
