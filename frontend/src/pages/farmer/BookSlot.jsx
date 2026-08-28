import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Wheat, Building2, CalendarDays, Clock, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const BookSlot = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [crops, setCrops] = useState([]);
  const [centres, setCentres] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Form selections
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [expectedQuantity, setExpectedQuantity] = useState(40);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch initial crops & centres
    api.get('/crops').then(res => setCrops(res.data));
    api.get('/centres').then(res => setCentres(res.data));

    // Default selected date = today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Fetch available slots whenever centre or date changes
  useEffect(() => {
    if (selectedCentre && selectedDate) {
      api.get(`/slots/available?centre_id=${selectedCentre.id}&date=${selectedDate}`)
        .then(res => setAvailableSlots(res.data))
        .catch(() => setAvailableSlots([]));
    }
  }, [selectedCentre, selectedDate]);

  const handleConfirmBooking = async () => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        crop_id: selectedCrop.id,
        expected_quantity: parseFloat(expectedQuantity),
        centre_id: selectedCentre.id,
        slot_id: selectedSlot.id
      };

      const res = await api.post('/bookings', payload);
      navigate(`/farmer/booking-confirmation/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Procurement Slot Booking</h1>
        <p className="text-xs text-slate-500 mt-1">Book your daily crop procurement slot to avoid long physical waiting times.</p>
      </div>

      {/* Step Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center text-xs font-semibold overflow-x-auto">
        {[
          { num: 1, label: 'Crop' },
          { num: 2, label: 'Quantity' },
          { num: 3, label: 'Centre' },
          { num: 4, label: 'Date' },
          { num: 5, label: 'Time Slot' },
          { num: 6, label: 'Confirm' },
        ].map(s => (
          <div
            key={s.num}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${step === s.num ? 'bg-emerald-600 text-white' : step > s.num ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400'}`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{s.num}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Wizard Steps */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {/* Step 1: Select Crop */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wheat className="w-5 h-5 text-emerald-600" /> Step 1 – Select Crop
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {crops.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCrop(c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedCrop?.id === c.id ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <h3 className="font-bold text-slate-900">{c.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Unit: {c.unit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Quantity */}
        {step === 2 && (
          <div className="space-y-4 max-w-md">
            <h2 className="text-lg font-bold text-slate-900">Step 2 – Enter Quantity</h2>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Expected Quantity (Quintal)</label>
              <input
                type="number"
                min="1"
                max="500"
                value={expectedQuantity}
                onChange={(e) => setExpectedQuantity(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-500 mt-1">Unit: Quintals (Qtl)</p>
            </div>
          </div>
        )}

        {/* Step 3: Select Centre */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" /> Step 3 – Select Procurement Centre
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {centres.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCentre(c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedCentre?.id === c.id ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <h3 className="font-bold text-slate-900">{c.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">{c.address}, {c.district}</p>
                  <div className="mt-2 pt-2 border-t flex justify-between text-xs text-slate-500">
                    <span>Capacity: {c.capacity}/day</span>
                    <span>Avg process time: {c.average_processing_time} mins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Select Date */}
        {step === 4 && (
          <div className="space-y-4 max-w-md">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-600" /> Step 4 – Select Date
            </h2>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Step 5: Time Slot */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" /> Step 5 – Select Time Slot
            </h2>
            {availableSlots.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl border">No slots configured for this date & centre.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableSlots.map(s => {
                  const isFull = s.status === 'FULL' || s.booked_count >= s.capacity;
                  const isSelected = selectedSlot?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      disabled={isFull}
                      onClick={() => setSelectedSlot(s)}
                      className={`p-3 rounded-xl border text-xs text-center transition-all ${
                        isFull
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md'
                          : 'bg-white border-slate-200 hover:border-emerald-500 text-slate-800'
                      }`}
                    >
                      <p className="font-bold">{s.start_time} - {s.end_time}</p>
                      <p className="text-[10px] mt-1">{isFull ? 'FULL' : `${s.capacity - s.booked_count} spots left`}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 6: Confirmation */}
        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Step 6 – Confirm Booking Summary</h2>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Crop:</span>
                <span className="font-bold text-slate-900">{selectedCrop?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Expected Quantity:</span>
                <span className="font-bold text-slate-900">{expectedQuantity} Quintal</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Procurement Centre:</span>
                <span className="font-bold text-slate-900">{selectedCentre?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Date:</span>
                <span className="font-bold text-slate-900">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-bold text-emerald-700">{selectedSlot?.start_time} – {selectedSlot?.end_time}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? 'Generating Token...' : 'CONFIRM BOOKING'}
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div></div>}

          {step < 6 && (
            <button
              disabled={
                (step === 1 && !selectedCrop) ||
                (step === 3 && !selectedCentre) ||
                (step === 5 && !selectedSlot)
              }
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 px-5 py-2.5 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-colors disabled:opacity-40"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
