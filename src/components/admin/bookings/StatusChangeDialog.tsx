import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Booking, BookingStatus } from '../../../types/booking';

interface StatusChangeDialogProps {
  isOpen: boolean;
  booking: Booking;
  onClose: () => void;
  onStatusChange: (bookingId: string, newStatus: BookingStatus, contractFile?: File) => Promise<void>;
}

export default function StatusChangeDialog({
  isOpen,
  booking,
  onClose,
  onStatusChange
}: StatusChangeDialogProps) {
  const [newStatus, setNewStatus] = useState<BookingStatus>(booking.status);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (newStatus === 'reserved' && !contractFile && !booking.contractUrl) {
        setError('Contract is required for reserved status');
        return;
      }

      await onStatusChange(booking.id, newStatus, contractFile || undefined);
      onClose();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Change Booking Status</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
              className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-primary"
            >
              <option value="available">Available</option>
              <option value="pre_reserved">Pre-reserved</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          {newStatus === 'reserved' && !booking.contractUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setContractFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}