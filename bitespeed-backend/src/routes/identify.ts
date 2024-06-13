import { Router } from 'express';
import Contact from '../models/Contact';

const router = Router();

router.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  let primaryContact = null;

  if (email || phoneNumber) {
    // Find the existing primary contact
    primaryContact = await Contact.findOne({ linkPrecedence: 'primary', $or: [{ email }, { phoneNumber }] });

    if (!primaryContact) {
      // If no primary contact found, create a new one
      primaryContact = new Contact({
        email,
        phoneNumber,
        linkPrecedence: 'primary',
      });
      await primaryContact.save();
    }
  }

  // Find all linked contacts
  const linkedContacts = await Contact.find({ linkedId: primaryContact?._id });

  const emails = Array.from(new Set([primaryContact?.email, ...linkedContacts.map(c => c.email)]));
  const phoneNumbers = Array.from(new Set([primaryContact?.phoneNumber, ...linkedContacts.map(c => c.phoneNumber)]));
  const secondaryContactIds = linkedContacts.map(c => c._id);

  if (email && phoneNumber) {
    // Check if a new secondary contact needs to be created
    const existingContact = await Contact.findOne({ email, phoneNumber });
    if (!existingContact) {
      const newSecondaryContact = new Contact({
        email,
        phoneNumber,
        linkPrecedence: 'secondary',
        linkedId: primaryContact?._id,
      });
      await newSecondaryContact.save();
      secondaryContactIds.push(newSecondaryContact._id);
    }
  }

  res.json({
    contact: {
      primaryContatctId: primaryContact?._id,
      emails: emails.filter(Boolean),
      phoneNumbers: phoneNumbers.filter(Boolean),
      secondaryContactIds,
    },
  });
});

export default router;
