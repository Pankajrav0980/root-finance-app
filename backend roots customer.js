const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', async (req, res) => {
  const { name, email, phone, loan, interest, months, startDate } = req.body;
  const emi = calculateEMI(loan, interest, months);
  const overdue = calculateOverdue(startDate, emi, months);
  const customer = new Customer({ name, email, phone, loan, interest, months, startDate, emi, overdue });
  await customer.save();
  res.json(customer);
});

router.get('/', async (req, res) => {
  const customers = await Customer.find().lean().sort({ createdAt: -1 });
  res.json(customers);
});

router.get('/pdf', async (req, res) => {
  const customers = await Customer.find().lean();
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="root_finance_customers.pdf"');
  doc.fontSize(20).text('Root Finance – Customer List', { align: 'center' }).moveDown();

  customers.forEach(c => {
    doc.fontSize(12).text(${c.name} | ₹${c.loan} | EMI: ₹${c.emi} | Overdue: ₹${c.overdue});
  });

  doc.end();
});

function calculateEMI(P, R, N) {
  const r = R / 1200;
  return Math.round((P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1));
}

function calculateOverdue(startDate, emi, months) {
  const start = new Date(startDate);
  const now = new Date();
  const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const overdueMonths = Math.max(0, diffMonths - months);
  return overdueMonths * emi;
}

module.exports = router;