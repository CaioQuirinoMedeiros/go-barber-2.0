interface IMailConfig {
  driver: 'ethereal' | 'sendgrid';
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
      name: 'Caio Quirino Medeiros',
    },
  },
} as IMailConfig;
