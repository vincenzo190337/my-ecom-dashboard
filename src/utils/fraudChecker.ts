import { CourierFraudReport, CrmCustomer } from '../types';

export function normalizeBdPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('880')) {
    return '0' + digits.slice(3);
  }
  if (digits.startsWith('88') && digits.length === 13) {
    return '0' + digits.slice(2);
  }
  return digits;
}

// Known sample profiles
const KNOWN_REPORTS: Record<string, Partial<CourierFraudReport>> = {
  '01711987654': {
    customerName: 'Tanjina Akter',
    totalParcels: 22,
    delivered: 22,
    cancelled: 0,
    deliveryRate: 100,
    courierBreakdown: {
      steadfast: { delivered: 14, cancelled: 0 },
      pathao: { delivered: 6, cancelled: 0 },
      redx: { delivered: 2, cancelled: 0 },
      paperfly: { delivered: 0, cancelled: 0 },
      ecourier: { delivered: 0, cancelled: 0 },
    },
    riskLevel: 'Safe',
    recommendation: '১০০% বিশ্বস্ত নিয়মিত কাস্টমার। কোনো অগ্রিম ছাড়া ক্যাশ অন ডেলিভারি দেওয়া যাবে।',
    notes: [
      'Steadfast Verified: পার্সেল রিসিভ হার ১০০%',
      'রাইডারকে কখনো ফেরত পাঠাননি, দ্রুত পেমেন্ট পরিশোধ করেন।',
    ],
  },
  '01844123987': {
    customerName: 'Sadia Islam Mim',
    totalParcels: 14,
    delivered: 13,
    cancelled: 1,
    deliveryRate: 93,
    courierBreakdown: {
      steadfast: { delivered: 8, cancelled: 0 },
      pathao: { delivered: 4, cancelled: 1 },
      redx: { delivered: 1, cancelled: 0 },
      paperfly: { delivered: 0, cancelled: 0 },
      ecourier: { delivered: 0, cancelled: 0 },
    },
    riskLevel: 'Safe',
    recommendation: 'নিরাপদ কাস্টমার। ডেলিভারি কনফার্মেশন দিয়ে পার্সেল পাঠানো নিরাপদ।',
    notes: [
      'Pathao তে ১টি পার্সেল সাইজ মিসম্যাচের কারণে ফেরত ছিল।',
      'সার্বিক ডেলিভারি সাকসেস ৯৩%।',
    ],
  },
  '01988001122': {
    customerName: 'Rana Ahmed (Reported Fraud)',
    totalParcels: 11,
    delivered: 1,
    cancelled: 10,
    deliveryRate: 9,
    courierBreakdown: {
      steadfast: { delivered: 1, cancelled: 5 },
      pathao: { delivered: 0, cancelled: 3 },
      redx: { delivered: 0, cancelled: 2 },
      paperfly: { delivered: 0, cancelled: 0 },
      ecourier: { delivered: 0, cancelled: 0 },
    },
    riskLevel: 'High',
    recommendation: 'উচ্চ ঝুঁকিপূর্ণ ভুয়া কাস্টমার! সম্পূর্ণ পণ্যের মূল্য এবং ডেলিভারি চার্জ অগ্রিম ছাড়া পার্সেল বুক করবেন না।',
    notes: [
      '🚨 Steadfast Alert: ডেলিভারি রাইডার যাওয়ার পর ফোন বন্ধ পাওয়া গেছে (৫ বার)।',
      '🚨 Pathao Alert: কাস্টমার পার্সেল রিসিভ করতে অস্বীকৃতি জানিয়েছে।',
      '🚨 RedX Alert: ভুয়া ঠিকানা ব্যবহার করে অর্ডার বাতিল।',
    ],
  },
  '01700112233': {
    customerName: 'Fake Order Ring (Reported)',
    totalParcels: 8,
    delivered: 0,
    cancelled: 8,
    deliveryRate: 0,
    courierBreakdown: {
      steadfast: { delivered: 0, cancelled: 4 },
      pathao: { delivered: 0, cancelled: 2 },
      redx: { delivered: 0, cancelled: 1 },
      paperfly: { delivered: 0, cancelled: 1 },
      ecourier: { delivered: 0, cancelled: 0 },
    },
    riskLevel: 'High',
    recommendation: 'ভুয়া অর্ডার ও পার্সেল রিটার্ন ফ্রড চক্র। পার্সেল পাঠানো নিষিদ্ধ!',
    notes: [
      'সকল কুরিয়ার সার্ভিসে ১০০% ক্যান্সেলেশন রেকর্ড রয়েছে।',
      'Courier Fraud Database Blacklisted.',
    ],
  },
  '01677889900': {
    customerName: 'Farzana Yasmin',
    totalParcels: 10,
    delivered: 7,
    cancelled: 3,
    deliveryRate: 70,
    courierBreakdown: {
      steadfast: { delivered: 4, cancelled: 1 },
      pathao: { delivered: 2, cancelled: 1 },
      redx: { delivered: 1, cancelled: 1 },
      paperfly: { delivered: 0, cancelled: 0 },
      ecourier: { delivered: 0, cancelled: 0 },
    },
    riskLevel: 'Moderate',
    recommendation: 'মাঝারি ঝুঁকি। ডেলিভারি চার্জ (ঢাকার ভেতর ৳৮০ / বাইরে ৳১৫০) বিকাশ বা নগদে অগ্রিম নিয়ে অর্ডার কনফার্ম করুন।',
    notes: [
      'মাঝে মাঝে পার্সেল রিসিভ না করে ফেরত পাঠান।',
      'অগ্রিম ডেলিভারি ফি নেওয়া বাধ্যতামূলক।',
    ],
  },
};

export function checkCustomerFraud(
  rawPhone: string,
  localCrmCustomers?: CrmCustomer[]
): CourierFraudReport {
  const phone = normalizeBdPhone(rawPhone);

  // Check in local CRM state if customer exists
  if (localCrmCustomers) {
    const existing = localCrmCustomers.find(
      (c) => normalizeBdPhone(c.phone) === phone
    );
    if (existing) {
      if (existing.isBlacklisted) {
        return {
          phone,
          customerName: existing.name,
          totalParcels: Math.max(3, existing.totalOrders),
          delivered: existing.deliveredCount,
          cancelled: Math.max(3, existing.cancelledCount),
          deliveryRate: 15,
          courierBreakdown: {
            steadfast: { delivered: existing.deliveredCount, cancelled: 3 },
            pathao: { delivered: 0, cancelled: 2 },
            redx: { delivered: 0, cancelled: 1 },
            paperfly: { delivered: 0, cancelled: 0 },
            ecourier: { delivered: 0, cancelled: 0 },
          },
          riskLevel: 'High',
          recommendation: 'এই নম্বরটি মার্চেন্ট সিস্টেমে ব্ল্যাকলিস্টেড রয়েছে! পার্সেল পাঠানো থেকে বিরত থাকুন।',
          notes: [
            existing.notes || 'মার্চেন্ট প্যানেলে ভুয়া কাস্টমার হিসেবে ব্লক করা হয়েছে।',
            'কুরিয়ার চার্জের আর্থিক ক্ষতি এড়াতে অগ্রিম নিন।',
          ],
        };
      }
    }
  }

  // Check known database
  if (KNOWN_REPORTS[phone]) {
    const r = KNOWN_REPORTS[phone]!;
    return {
      phone,
      customerName: r.customerName || 'গ্রাহক',
      totalParcels: r.totalParcels || 0,
      delivered: r.delivered || 0,
      cancelled: r.cancelled || 0,
      deliveryRate: r.deliveryRate || 0,
      courierBreakdown: r.courierBreakdown || {
        steadfast: { delivered: 0, cancelled: 0 },
        pathao: { delivered: 0, cancelled: 0 },
        redx: { delivered: 0, cancelled: 0 },
        paperfly: { delivered: 0, cancelled: 0 },
        ecourier: { delivered: 0, cancelled: 0 },
      },
      riskLevel: r.riskLevel || 'Safe',
      recommendation: r.recommendation || '',
      notes: r.notes || [],
    };
  }

  // Deterministic simulation for any new/custom phone number based on digits
  if (phone.length < 8) {
    return {
      phone,
      totalParcels: 0,
      delivered: 0,
      cancelled: 0,
      deliveryRate: 0,
      courierBreakdown: {
        steadfast: { delivered: 0, cancelled: 0 },
        pathao: { delivered: 0, cancelled: 0 },
        redx: { delivered: 0, cancelled: 0 },
        paperfly: { delivered: 0, cancelled: 0 },
        ecourier: { delivered: 0, cancelled: 0 },
      },
      riskLevel: 'Safe',
      recommendation: 'সঠিক ১১ ডিজিটের ফোন নম্বর লিখুন (e.g. 01711223344)',
      notes: ['ফোন নম্বর অসম্পূর্ণ'],
    };
  }

  // Generate deterministic realistic score based on number digits
  const seed = phone.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const total = 5 + (seed % 14); // 5 to 18 orders
  const cancelSeed = (seed * 7) % 100;

  let cancelled = 0;
  let riskLevel: 'Safe' | 'Moderate' | 'High' = 'Safe';
  let recommendation = '';
  const notes: string[] = [];

  if (cancelSeed > 75) {
    // High risk (e.g. 50%+ cancel)
    cancelled = Math.max(3, Math.floor(total * 0.6));
    riskLevel = 'High';
    recommendation = 'উচ্চ ঝুঁকি! বিভিন্ন কুরিয়ারে পার্সেল ক্যান্সেলেশন রেকর্ড বেশি। ডেলিভারি চার্জ অগ্রিম নিন।';
    notes.push('Steadfast: রিটার্ন রেশিও বেশি পরিলক্ষিত হয়েছে।');
    notes.push('সতর্কতা: অর্ডার নিশ্চিত করতে ফোনে ভয়েস কল করে ঠিকানা যাচাই করুন।');
  } else if (cancelSeed > 45) {
    // Moderate risk
    cancelled = Math.max(1, Math.floor(total * 0.25));
    riskLevel = 'Moderate';
    recommendation = 'মাঝারি ঝুঁকি। ডেলিভারি চার্জ অগ্রিম নিয়ে পার্সেল পাঠানো নিরাপদ হবে।';
    notes.push('Pathao ও Steadfast এ পূর্ববর্তী ডেলিভারি রেকর্ড বিদ্যমান।');
  } else {
    // Safe
    cancelled = seed % 2 === 0 ? 0 : 1;
    riskLevel = 'Safe';
    recommendation = 'নিরাপদ গ্রাহক। ভালো ডেলিভারি গ্রহণযোগ্যতার রেকর্ড রয়েছে।';
    notes.push('Steadfast & Pathao ভেরিফাইড ভালো ডেলিভারি হিস্ট্রি।');
  }

  const delivered = Math.max(0, total - cancelled);
  const deliveryRate = Math.round((delivered / total) * 100);

  // Split across couriers
  const sfDel = Math.round(delivered * 0.6);
  const ptDel = Math.round(delivered * 0.3);
  const rxDel = delivered - sfDel - ptDel;

  const sfCan = Math.round(cancelled * 0.6);
  const ptCan = Math.round(cancelled * 0.3);
  const rxCan = cancelled - sfCan - ptCan;

  return {
    phone,
    customerName: 'কুরিয়ার রেকর্ডপ্রাপ্ত গ্রাহক',
    totalParcels: total,
    delivered,
    cancelled,
    deliveryRate,
    courierBreakdown: {
      steadfast: { delivered: sfDel, cancelled: sfCan },
      pathao: { delivered: ptDel, cancelled: ptCan },
      redx: { delivered: Math.max(0, rxDel), cancelled: Math.max(0, rxCan) },
      paperfly: { delivered: 0, cancelled: 0 },
      ecourier: { delivered: 0, cancelled: 0 },
    },
    riskLevel,
    recommendation,
    notes,
  };
}
