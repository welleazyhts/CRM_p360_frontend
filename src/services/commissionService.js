/**
 * Commission Calculation & Tracking Service
 *
 * Handles insurance commission calculations, tracking, and payments including:
 * - Commission rules and tiers
 * - Premium-based calculations
 * - Performance-based bonuses
 * - Payment tracking and reconciliation
 * - Tax/TDS calculations
 * - Commission statements
 */

// Commission types
export const COMMISSION_TYPE = {
  NEW_BUSINESS: 'new_business',
  RENEWAL: 'renewal',
  REFERRAL: 'referral',
  OVERRIDE: 'override', // Manager/supervisor commission
  BONUS: 'bonus'
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled'
};

// Insurance product types
export const PRODUCT_TYPE = {
  MOTOR: 'motor',
  HEALTH: 'health',
  LIFE: 'life',
  PROPERTY: 'property',
  TRAVEL: 'travel',
  MARINE: 'marine'
};

/**
 * Default commission rates by product and type
 * Rates are in percentage
 */
export const DEFAULT_COMMISSION_RATES = {
  [PRODUCT_TYPE.MOTOR]: {
    [COMMISSION_TYPE.NEW_BUSINESS]: 15,
    [COMMISSION_TYPE.RENEWAL]: 7.5,
    [COMMISSION_TYPE.REFERRAL]: 2
  },
  [PRODUCT_TYPE.HEALTH]: {
    [COMMISSION_TYPE.NEW_BUSINESS]: 20,
    [COMMISSION_TYPE.RENEWAL]: 10,
    [COMMISSION_TYPE.REFERRAL]: 3
  },
  [PRODUCT_TYPE.LIFE]: {
    [COMMISSION_TYPE.NEW_BUSINESS]: 25,
    [COMMISSION_TYPE.RENEWAL]: 5,
    [COMMISSION_TYPE.REFERRAL]: 2
  },
  [PRODUCT_TYPE.PROPERTY]: {
    [COMMISSION_TYPE.NEW_BUSINESS]: 18,
    [COMMISSION_TYPE.RENEWAL]: 9,
    [COMMISSION_TYPE.REFERRAL]: 2.5
  },
  [PRODUCT_TYPE.TRAVEL]: {
    [COMMISSION_TYPE.NEW_BUSINESS]: 12,
    [COMMISSION_TYPE.RENEWAL]: 6,
    [COMMISSION_TYPE.REFERRAL]: 1.5
  }
};

/**
 * Commission tier structure
 * Higher tiers earn higher commission rates
 */
export const COMMISSION_TIERS = {
  bronze: {
    name: 'Bronze',
    minPremium: 0,
    maxPremium: 500000,
    multiplier: 1.0,
    color: '#cd7f32'
  },
  silver: {
    name: 'Silver',
    minPremium: 500001,
    maxPremium: 1500000,
    multiplier: 1.1,
    color: '#c0c0c0'
  },
  gold: {
    name: 'Gold',
    minPremium: 1500001,
    maxPremium: 3000000,
    multiplier: 1.2,
    color: '#ffd700'
  },
  platinum: {
    name: 'Platinum',
    minPremium: 3000001,
    maxPremium: Infinity,
    multiplier: 1.3,
    color: '#e5e4e2'
  }
};

/**
 * Calculate basic commission
 */
export const calculateBasicCommission = (premium, rate) => {
  return (premium * rate) / 100;
};

/**
 * Get agent tier based on total premium
 */
export const getAgentTier = (totalPremium) => {
  for (const [key, tier] of Object.entries(COMMISSION_TIERS)) {
    if (totalPremium >= tier.minPremium && totalPremium <= tier.maxPremium) {
      return { key, ...tier };
    }
  }
  return { key: 'bronze', ...COMMISSION_TIERS.bronze };
};

/**
 * Calculate commission with tier multiplier
 */
export const calculateTieredCommission = (premium, rate, tierMultiplier) => {
  const basicCommission = calculateBasicCommission(premium, rate);
  return basicCommission * tierMultiplier;
};

/**
 * Calculate performance bonus
 */
export const calculatePerformanceBonus = (totalCommission, achievementPercent) => {
  if (achievementPercent < 100) return 0;

  // Bonus tiers
  if (achievementPercent >= 150) {
    return totalCommission * 0.15; // 15% bonus for 150%+ achievement
  } else if (achievementPercent >= 125) {
    return totalCommission * 0.10; // 10% bonus for 125%+ achievement
  } else if (achievementPercent >= 100) {
    return totalCommission * 0.05; // 5% bonus for 100%+ achievement
  }

  return 0;
};

/**
 * Calculate TDS (Tax Deducted at Source)
 * Standard TDS rate is 10% for commissions in India
 */
export const calculateTDS = (commission, tdsRate = 10) => {
  return (commission * tdsRate) / 100;
};

/**
 * Calculate net commission after TDS
 */
export const calculateNetCommission = (grossCommission, tdsRate = 10) => {
  const tds = calculateTDS(grossCommission, tdsRate);
  return {
    gross: grossCommission,
    tds,
    net: grossCommission - tds
  };
};

/**
 * Calculate override commission for managers
 */
export const calculateOverrideCommission = (agentCommission, overrideRate = 5) => {
  return (agentCommission * overrideRate) / 100;
};

/**
 * Calculate full commission breakdown
 */
export const calculateCommissionBreakdown = (policy, agent, config = {}) => {
  const {
    premium = 0,
    productType = PRODUCT_TYPE.MOTOR,
    commissionType = COMMISSION_TYPE.NEW_BUSINESS,
    customRate = null
  } = policy;

  const {
    totalPremiumYTD = 0,
    targetPremium = 0,
    tdsRate = 10,
    overrideManager = null
  } = agent;

  // Get commission rate
  const defaultRate = DEFAULT_COMMISSION_RATES[productType]?.[commissionType] || 10;
  const rate = customRate !== null ? customRate : defaultRate;

  // Get agent tier
  const tier = getAgentTier(totalPremiumYTD);

  // Calculate basic and tiered commission
  const basicCommission = calculateBasicCommission(premium, rate);
  const tieredCommission = calculateTieredCommission(premium, rate, tier.multiplier);

  // Calculate performance bonus
  const achievementPercent = targetPremium > 0 ? (totalPremiumYTD / targetPremium) * 100 : 0;
  const performanceBonus = calculatePerformanceBonus(tieredCommission, achievementPercent);

  // Calculate gross commission
  const grossCommission = tieredCommission + performanceBonus;

  // Calculate TDS and net
  const { tds, net } = calculateNetCommission(grossCommission, tdsRate);

  // Calculate override if manager exists
  const overrideCommission = overrideManager
    ? calculateOverrideCommission(tieredCommission, config.overrideRate || 5)
    : 0;

  return {
    premium,
    rate,
    tier: tier.key,
    tierMultiplier: tier.multiplier,
    basicCommission,
    tieredCommission,
    achievementPercent: Math.round(achievementPercent),
    performanceBonus,
    grossCommission,
    tds,
    netCommission: net,
    overrideCommission,
    breakdown: {
      basic: basicCommission,
      tierBonus: tieredCommission - basicCommission,
      performanceBonus,
      override: overrideCommission,
      tds: -tds
    }
  };
};

/**
 * Generate commission statement for a period
 */
export const generateCommissionStatement = (commissions, periodStart, periodEnd) => {
  const statement = {
    periodStart,
    periodEnd,
    totalPolicies: 0,
    totalPremium: 0,
    grossCommission: 0,
    totalTDS: 0,
    netCommission: 0,
    byProduct: {},
    byType: {},
    byStatus: {}
  };

  commissions.forEach(comm => {
    // Filter by date
    const commDate = new Date(comm.policyDate);
    if (commDate < new Date(periodStart) || commDate > new Date(periodEnd)) {
      return;
    }

    statement.totalPolicies++;
    statement.totalPremium += comm.premium || 0;
    statement.grossCommission += comm.grossCommission || 0;
    statement.totalTDS += comm.tds || 0;
    statement.netCommission += comm.netCommission || 0;

    // By product
    const product = comm.productType || 'unknown';
    if (!statement.byProduct[product]) {
      statement.byProduct[product] = {
        count: 0,
        premium: 0,
        commission: 0
      };
    }
    statement.byProduct[product].count++;
    statement.byProduct[product].premium += comm.premium || 0;
    statement.byProduct[product].commission += comm.netCommission || 0;

    // By type
    const type = comm.commissionType || 'unknown';
    if (!statement.byType[type]) {
      statement.byType[type] = {
        count: 0,
        commission: 0
      };
    }
    statement.byType[type].count++;
    statement.byType[type].commission += comm.netCommission || 0;

    // By status
    const status = comm.paymentStatus || 'pending';
    if (!statement.byStatus[status]) {
      statement.byStatus[status] = {
        count: 0,
        amount: 0
      };
    }
    statement.byStatus[status].count++;
    statement.byStatus[status].amount += comm.netCommission || 0;
  });

  return statement;
};

/**
 * Get commission summary statistics
 */
export const getCommissionStatistics = (commissions) => {
  const stats = {
    total: commissions.length,
    totalPremium: 0,
    totalGross: 0,
    totalTDS: 0,
    totalNet: 0,
    pending: 0,
    approved: 0,
    paid: 0,
    averageCommissionRate: 0,
    highestCommission: null,
    byAgent: {}
  };

  let totalRate = 0;
  let maxCommission = 0;

  commissions.forEach(comm => {
    stats.totalPremium += comm.premium || 0;
    stats.totalGross += comm.grossCommission || 0;
    stats.totalTDS += comm.tds || 0;
    stats.totalNet += comm.netCommission || 0;

    // Count by status
    if (comm.paymentStatus === PAYMENT_STATUS.PENDING) stats.pending++;
    if (comm.paymentStatus === PAYMENT_STATUS.APPROVED) stats.approved++;
    if (comm.paymentStatus === PAYMENT_STATUS.PAID) stats.paid++;

    // Track highest commission
    if (comm.netCommission > maxCommission) {
      maxCommission = comm.netCommission;
      stats.highestCommission = comm;
    }

    // Calculate average rate
    if (comm.rate) {
      totalRate += comm.rate;
    }

    // By agent
    const agentId = comm.agentId || 'unknown';
    if (!stats.byAgent[agentId]) {
      stats.byAgent[agentId] = {
        agentName: comm.agentName || agentId,
        count: 0,
        totalCommission: 0
      };
    }
    stats.byAgent[agentId].count++;
    stats.byAgent[agentId].totalCommission += comm.netCommission || 0;
  });

  stats.averageCommissionRate = stats.total > 0 ? totalRate / stats.total : 0;

  return stats;
};

/**
 * Filter commissions by various criteria
 */
export const filterCommissions = (commissions, filters) => {
  let filtered = [...commissions];

  if (filters.agentId) {
    filtered = filtered.filter(c => c.agentId === filters.agentId);
  }

  if (filters.productType) {
    filtered = filtered.filter(c => c.productType === filters.productType);
  }

  if (filters.commissionType) {
    filtered = filtered.filter(c => c.commissionType === filters.commissionType);
  }

  if (filters.paymentStatus) {
    filtered = filtered.filter(c => c.paymentStatus === filters.paymentStatus);
  }

  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    filtered = filtered.filter(c => {
      const date = new Date(c.policyDate);
      return date >= new Date(start) && date <= new Date(end);
    });
  }

  if (filters.minCommission !== undefined) {
    filtered = filtered.filter(c => c.netCommission >= filters.minCommission);
  }

  if (filters.maxCommission !== undefined) {
    filtered = filtered.filter(c => c.netCommission <= filters.maxCommission);
  }

  return filtered;
};

/**
 * Sort commissions
 */
export const sortCommissions = (commissions, sortBy = 'policyDate', order = 'desc') => {
  const sorted = [...commissions];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'policyDate':
        comparison = new Date(a.policyDate) - new Date(b.policyDate);
        break;
      case 'premium':
        comparison = (a.premium || 0) - (b.premium || 0);
        break;
      case 'commission':
        comparison = (a.netCommission || 0) - (b.netCommission || 0);
        break;
      case 'agentName':
        comparison = (a.agentName || '').localeCompare(b.agentName || '');
        break;
      default:
        comparison = 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

export default {
  COMMISSION_TYPE,
  PAYMENT_STATUS,
  PRODUCT_TYPE,
  DEFAULT_COMMISSION_RATES,
  COMMISSION_TIERS,
  calculateBasicCommission,
  getAgentTier,
  calculateTieredCommission,
  calculatePerformanceBonus,
  calculateTDS,
  calculateNetCommission,
  calculateOverrideCommission,
  calculateCommissionBreakdown,
  generateCommissionStatement,
  getCommissionStatistics,
  filterCommissions,
  sortCommissions
};
