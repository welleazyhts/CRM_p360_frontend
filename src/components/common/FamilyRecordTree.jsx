import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { 
  DriveEta as DriveIcon, 
  Description as DescriptionIcon, 
  Visibility as VisibilityIcon, 
  ExpandMore, 
  ChevronRight 
} from '@mui/icons-material';
import './FamilyRecordTree.css';

/**
 * FamilyRecordTree
 * Props:
 * - customer: object with vehicles[], familyMembers[], policies[]
 * - onViewPolicy(policy) optional callback when user clicks view on a policy
 * - onViewVehicle(vehicle) optional callback when user clicks view on a vehicle
 */
const FamilyRecordTree = ({ customer, onViewPolicy = () => {}, onViewVehicle = () => {} }) => {
  const navigate = useNavigate();

  // ✅ Hooks must always be declared first
  const [expanded, setExpanded] = useState({});

  // Initialize expanded state when customer changes
  React.useEffect(() => {
    if (customer?.id) {
      setExpanded({ [`c-${customer.id}`]: true });
    }
  }, [customer]);

  // ✅ Return null *after* hooks are declared
  if (!customer) {
    return null;
  }

  // Development-only debug
  if (process.env.NODE_ENV === 'development') {
    console.debug('FamilyRecordTree: customer data =>', {
      id: customer.id,
      name: customer.name,
      vehiclesCount: (customer.vehicles || []).length,
      familyMembersCount: (customer.familyMembers || []).length,
      policiesCount: (customer.policies || []).length
    });
  }

  // Toggle expand/collapse
  const handleToggle = (nodeId) => {
    setExpanded((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Recursive render function
  const renderNode = (node, nodeId, label, children = null, icon = null) => (
    <li className="tree-item" key={nodeId}>
      <div className="label-content">
        {children ? (
          <span onClick={() => handleToggle(nodeId)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {expanded[nodeId] ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
            {icon}
            {label}
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center' }}>{icon}{label}</span>
        )}
      </div>
      {children && expanded[nodeId] && (
        <ul style={{ listStyle: 'none', marginLeft: 24, paddingLeft: 12, borderLeft: '1px dashed #e0e0e0' }}>
          {children}
        </ul>
      )}
    </li>
  );

  // Vehicles node
  const vehiclesNode = (customer.vehicles || []).length > 0
    ? renderNode(
        null,
        `c-${customer.id}-vehicles`,
        <span className="section-header"><DriveIcon fontSize="small" /> Vehicles</span>,
        (customer.vehicles || []).map((v) =>
          renderNode(
            null,
            `v-${v.vin || v.id}`,
            <>
              <span className="entity-name">{v.make ? `${v.make} ${v.model}` : (v.vin || 'Vehicle')}</span>
              <span className="date-chip">{v.lastUpdated || v.capturedAt || '-'}</span>
              <button className="view-button" onClick={(e) => { e.stopPropagation(); onViewVehicle(v); }} title="View vehicle"><VisibilityIcon fontSize="small" /></button>
            </>,
            null
          )
        ),
        null
      )
    : null;

  // Family members node
  const familyNodes = (customer.familyMembers || []).map((m) => {
    const memberVehicles = (m.vehicles || []).length > 0
      ? renderNode(
          null,
          `f-${m.id}-vehicles`,
          <span className="section-header"><DriveIcon fontSize="small" /> Vehicles</span>,
          (m.vehicles || []).map((mv) =>
            renderNode(
              null,
              `mv-${mv.vin || mv.id}`,
              <>
                <span className="entity-name">{mv.make ? `${mv.make} ${mv.model}` : (mv.vin || 'Vehicle')}</span>
                <span className="date-chip">{mv.lastUpdated || mv.capturedAt || '-'}</span>
                <button className="view-button" onClick={(e) => { e.stopPropagation(); onViewVehicle(mv); }} title="View vehicle"><VisibilityIcon fontSize="small" /></button>
              </>,
              null
            )
          ),
          null
        )
      : null;

    const memberPolicies = (m.coveredPolicies || []).length > 0
      ? renderNode(
          null,
          `f-${m.id}-policies`,
          <span className="section-header"><DescriptionIcon fontSize="small" /> Policies</span>,
          (m.coveredPolicies || []).map((p, idx) =>
            renderNode(
              null,
              `p-${m.id}-${idx}`,
              <>
                <span className="entity-name">{p.policyNumber || p}</span>
                <span className="date-chip">{p.lastUpdated || p.capturedAt || '-'}</span>
                <button className="view-button" onClick={(e) => { e.stopPropagation(); onViewPolicy(p); }} title="View policy"><VisibilityIcon fontSize="small" /></button>
              </>,
              null
            )
          ),
          null
        )
      : null;

    return renderNode(
      null,
      `f-${m.id}`,
      <>
        <span className="customer-name" onClick={() => navigate(`/customer-management/customer-profile/${m.id}`)}>
          {m.name} <span className="relationship">— {m.relationship}</span>
        </span>
        <span className="date-chip">{m.lastCapturedDate || m.lastUpdated || '-'}</span>
      </>,
      [memberVehicles, memberPolicies].filter(Boolean),
      null
    );
  });

  // Customer policies node
  const policiesNode = (customer.policies || []).length > 0
    ? renderNode(
        null,
        `c-${customer.id}-policies`,
        <span className="section-header"><DescriptionIcon fontSize="small" /> Policies</span>,
        (customer.policies || []).map((p) =>
          renderNode(
            null,
            `cp-${p.policyNumber || p.id}`,
            <>
              <span className="entity-name">{p.policyNumber || p}</span>
              <span className="date-chip">{p.lastUpdated || p.capturedAt || '-'}</span>
              <button className="view-button" onClick={(e) => { e.stopPropagation(); onViewPolicy(p); }} title="View policy"><VisibilityIcon fontSize="small" /></button>
            </>,
            null
          )
        ),
        null
      )
    : null;

  // Root node
  return (
    <div className="family-tree-container">
      <ul className="tree-view" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {renderNode(
          null,
          `c-${customer.id}`,
          <>
            <span className="customer-name" onClick={() => navigate(`/customer-management/customer-profile/${customer.id}`)}>
              {customer.name} (Self)
            </span>
            <span className="date-chip">{customer.lastCapturedDate || customer.lastContact || customer.registrationDate || '-'}</span>
          </>,
          [vehiclesNode, ...familyNodes, policiesNode].filter(Boolean),
          null
        )}
      </ul>
    </div>
  );
};

FamilyRecordTree.propTypes = {
  customer: PropTypes.object,
  onViewPolicy: PropTypes.func,
  onViewVehicle: PropTypes.func,
};

export default FamilyRecordTree;
