import { Router } from 'express';
import Contact from '../models/Contact';

const router = Router();

router.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  // Find contacts matching email or phoneNumber
  const existingContacts = await Contact.find({
    $or: [
      { email },
      { phoneNumber },
    ],
  });

  if (existingContacts.length === 0) {
    // No existing contact, create a new primary contact
    const newContact = new Contact({
      email,
      phoneNumber,
      linkPrecedence: 'primary',
    });
    const savedContact = await newContact.save();

    return res.json({
      contact: {
        primaryContatctId: savedContact._id,
        emails: email ? [email] : [],
        phoneNumbers: phoneNumber ? [phoneNumber] : [],
        secondaryContactIds: [],
      },
    });
  }

  // Find primary contact and all linked contacts
  const primaryContact = existingContacts.find(c => c.linkPrecedence === 'primary') || existingContacts[0];
  const linkedContacts = await Contact.find({
    linkedId: primaryContact._id,
  });

  // Aggregate all unique emails and phoneNumbers
  const emails = Array.from(new Set([primaryContact.email, ...linkedContacts.map(c => c.email)]));
  const phoneNumbers = Array.from(new Set([primaryContact.phoneNumber, ...linkedContacts.map(c => c.phoneNumber)]));
  const secondaryContactIds = linkedContacts.map(c => c._id);

  // Check if a new secondary contact needs to be created
  if (!existingContacts.some(c => c.email === email && c.phoneNumber === phoneNumber)) {
    const newSecondaryContact = new Contact({
      email,
      phoneNumber,
      linkPrecedence: 'secondary',
      linkedId: primaryContact._id,
    });
    await newSecondaryContact.save();
    secondaryContactIds.push(newSecondaryContact._id);
  }

  // Return the consolidated contact information
  return res.json({
    contact: {
      primaryContatctId: primaryContact._id,
      emails: emails.filter(e => e),
      phoneNumbers: phoneNumbers.filter(p => p),
      secondaryContactIds,
    },
  });
});

export default router;
