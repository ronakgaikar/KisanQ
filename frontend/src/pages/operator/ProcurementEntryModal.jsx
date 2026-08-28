import React, { useState } from 'react';
import api from '../../services/api';
import { X, CheckCircle2, Scale, Tag, Banknote } from 'lucide-react';

const ProcurementEntryModal = ({ booking, onClose, onSuccess }) => {
  const [actualQuantity, setActualQuantity] = useState(booking.expected_quantity);
  const [rate, setRate] = useState(2275);
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [remarks, setRemarks] = useState('Crop quality verified.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = (parseFloat(actualQuantity) || 0) * (parseFloat(rate) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/procurement', {
        booking_id: booking.booking_id_num || booking.booking_id,
        actual_quantity: parseFloat(actualQuantity),
        rate: parseFloat(rate),
        quality_grade: qualityGrade,
        remarks: remarks
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to record procurement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Scale className="w-5 h-5" /> Record Procurement Entry
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-xl">
              {error}
            </div>
          )}

          {/* Farmer & Booking Summary */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Token & Farmer</span>
              <p className="font-extrabold text-slate-900 text-sm">{booking.token} – {booking.farmer_name}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Crop & Expected</span>
              <p className="font-bold text-slate-800 text-sm">{booking.crop_name} ({booking.expected_quantity} Qtl)</p>
            </div>
          </div>

          {/* Actual Quantity */}
          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">
              Actual Measured Quantity (Quintal) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={actualQuantity}
              onChange={(e) => setActualQuantity(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Rate per Quintal */}
          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">
              Government Procurement Rate (₹ / Quintal) *
            </label>
            <input
              type="number"
              step="1"
              required
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Calculated Total */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center">
            <span className="font-bold text-emerald-800 uppercase text-[11px] flex items-center gap-1">
              <Banknote className="w-4 h-4 text-emerald-600" /> Total Calculated Amount
            </span>
            <span className="text-2xl font-black text-emerald-900">
              ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">Quality / Moisture Grade</label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none"
            >
              <option value="Grade A">Grade A (Premium)</option>
              <option value="Grade B">Grade B (Standard)</option>
              <option value="Fair Average Quality">Fair Average Quality (FAQ)</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">Remarks</label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Grain moisture 12%, verified."
              className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Procurement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcurementEntryModal;
