"use server";

import { SESClient } from "@aws-sdk/client-ses";
import { SendEmailCommand } from "@aws-sdk/client-ses";

const REGION = "us-east-1";
const access_key = process.env.PUBLIC_AWS_KEY;
const secret_access_key = process.env.PRIVATE_AWS_KEY;

const sesClient = new SESClient({ 
  region: REGION, 
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_access_key,
  }
});

const createSendCustomerEmailCommand = (toAddress, receipt) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <h2>Thank you for your order!</h2>
            <p>We're currently processing your order and will email you once your order has been shipped.</p>
            <p>You can view your online receipt <a href="${receipt}">here</a>.</p>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
            Thank you for your order! 

            We're currently processing your order and will email you once your order has been shipped.

            You can view your receipt at the following link: ${receipt}
        `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Order Confirmation",
      },
    },
    Source: "MLS Watercolors <noreply@marylousussmeier.com>",
  });
};

const sendCustomerEmail = async (toAddress, receipt) => {
  const sendEmailCommand = createSendCustomerEmailCommand(
    toAddress,
    receipt,
  );
  
  sendAdminEmail(toAddress);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

export { sendCustomerEmail };




// ADMIN EMAIL
const createSendAdminEmailCommand = (customer) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [
        "colesussmeier@gmail.com",
        "msussmeierart@gmail.com"
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <h2>A new order has been recieved from ${customer}.</h2>
            <p>Check the admin dashboard for more details.</p>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
            A new order has been recieved from ${customer}.

            Check the admin dashboard for more details.
        `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Order Received!",
      },
    },
    Source: "MLS Watercolors <noreply@marylousussmeier.com>",
  });
};

const sendAdminEmail = async (customer) => {
  const sendEmailCommand = createSendAdminEmailCommand(customer);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};




// SEND SHIPPING CONFIRMATION
const createSendConfirmationEmailCommand = (toAddress, trackingLink) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <h2>We have shipped your order!</h2>
            <p>You can track your order <a href="${trackingLink}">here</a>.</p>
            <p>Thank you for your support! If you have any questions or concerns, 
            please don't hesitate to reach out by emailing msussmeierart@gmail.com.</p>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
            We have shipped your order! 

            You can track your order with the following link: ${trackingLink}

            Thank you for your support! If you have any questions or concerns, 
            please don't hesitate to reach out by emailing msussmeierart@gmail.com.
        `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Your Order Has Shipped!",
      },
    },
    Source: "MLS Watercolors <noreply@marylousussmeier.com>",
  });
};

const sendConfirmationEmail = async (toAddress, trackingLink) => {
  const sendEmailCommand = createSendConfirmationEmailCommand(
    toAddress,
    trackingLink,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

export { sendConfirmationEmail };