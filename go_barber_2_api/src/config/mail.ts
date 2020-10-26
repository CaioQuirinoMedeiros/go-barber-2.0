interface IMailConfig {
  driver: 'ethereal' | 'sendgrid' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'caio.quirino.medeiros@gmail.com',
      name: 'GoBarber Support',
    },
  },
} as IMailConfig;
