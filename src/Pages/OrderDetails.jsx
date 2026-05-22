import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, CreditCard, Receipt, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Toast from "../components/Toast";
import InputBox from "../components/InputBox";
import Modal from "../components/Modal";
import API from "../utils/api";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleReturnRequest = async (e) => {
    e.preventDefault();
    if (!returnReason.trim()) return;
    setSubmittingReturn(true);
    try {
      const { data } = await API.put(`/orders/${id}/return`, { reason: returnReason });
      setOrder(data);
      setToast({ type: "success", message: "Return request submitted successfully!" });
      setShowReturnModal(false);
      setReturnReason("");
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Failed to submit return request." });
    } finally {
      setSubmittingReturn(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl max-w-md text-center border border-red-100">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Error Loading Order</h3>
            <p className="text-sm mb-4">{error || "Order not found."}</p>
            <Link to="/dashboard">
              <Button variant="secondary" size="sm">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Define steps for order tracker
  const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Style block to handle printing */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}} />

        {/* Back Link */}
        <div className="flex justify-between items-center mb-8 no-print">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2E7D32] transition">
            <ArrowLeft className="w-4 h-4" />
            <span>My Orders</span>
          </Link>
          <div className="flex gap-2">
            <Button onClick={handlePrintInvoice} variant="outline" size="sm" className="gap-1.5">
              <FileText className="w-4.5 h-4.5" /> Download Invoice
            </Button>
            {order.orderStatus === "Delivered" && !order.returnRequestStatus && (
              <Button onClick={() => setShowReturnModal(true)} variant="danger" size="sm">
                Return Order
              </Button>
            )}
          </div>
        </div>

        {/* Status Tracker */}
        {order.orderStatus !== "Cancelled" && order.orderStatus !== "Returned" ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 no-print">
            <h3 className="font-bold text-gray-700 text-sm mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#2E7D32]" /> Tracking Status
            </h3>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
              {/* Connector line for desktop */}
              <div className="absolute left-[3%] right-[3%] top-4 h-1 bg-gray-100 hidden md:block z-0">
                <div
                  className="h-full bg-[#2E7D32] transition-all duration-500"
                  style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%` }}
                ></div>
              </div>

              {statusSteps.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="flex md:flex-col items-center gap-3 md:gap-2 z-10 bg-white md:px-2 flex-1 w-full">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition ${
                        isActive
                          ? "bg-[#2E7D32] border-[#2E7D32] text-white"
                          : "bg-white border-gray-200 text-gray-300"
                      }`}
                    >
                      {isActive ? <CheckCircle2 className="w-5 h-5" /> : <span>{idx + 1}</span>}
                    </div>
                    <div className="text-left md:text-center">
                      <p className={`text-xs font-bold ${isCurrent ? "text-[#2E7D32]" : "text-gray-600"}`}>
                        {step === "Pending" ? "Placed" : step}
                      </p>
                      {step === "Delivered" && order.deliveredAt && (
                        <p className="text-[10px] text-gray-400">
                          {new Date(order.deliveredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4.5 mb-8 flex items-center gap-3 no-print">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Order Status: {order.orderStatus}</p>
              <p className="text-xs mt-0.5">
                {order.orderStatus === "Returned"
                  ? `Return request approved and refunded on ${new Date(order.refundedAt).toLocaleDateString()}.`
                  : "This order has been cancelled."}
              </p>
            </div>
          </div>
        )}

        {/* Printable/Display Invoice */}
        <div id="printable-invoice" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between border-b border-gray-100 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="bg-[#2E7D32] text-white font-black px-2 py-1 rounded text-sm">DN</span>
                <span className="text-lg font-bold text-[#1E293B]">
                  Daily<span className="text-[#2E7D32]">Nest</span>
                </span>
              </div>
              <p className="text-xs text-gray-400">Fresh daily essentials straight to your nest.</p>
              <p className="text-[10px] text-gray-400">GSTIN: 33AAAAA1111A1Z1</p>
            </div>

            <div className="md:text-right text-xs">
              <h2 className="text-lg font-black text-gray-800 uppercase mb-1">Tax Invoice</h2>
              <p className="font-semibold text-gray-500">Order ID: <span className="font-mono text-gray-800 font-bold select-all bg-gray-50 px-1 py-0.5 rounded">{order._id}</span></p>
              <p className="text-gray-400 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-400">Status: <span className="font-bold text-[#2E7D32]">{order.orderStatus}</span></p>
            </div>
          </div>

          {/* Customer & Payment Meta Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-gray-100 pb-6">
            <div>
              <h3 className="font-bold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Shipping Address
              </h3>
              <p className="font-bold text-[#1E293B]">{order.user.name}</p>
              <p className="text-gray-600 mt-1">{order.shippingAddress.street}</p>
              <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
              <p className="text-gray-400 mt-1">Ph: {order.user.mobileNumber}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Billing & Payment
              </h3>
              <p className="font-semibold text-gray-700">Payment Gateway: <span className="font-bold text-gray-900">{order.paymentMethod}</span></p>
              <p className="text-gray-500 mt-1">Status: <span className="font-bold text-[#2E7D32] capitalize">{order.paymentStatus}</span></p>
              {order.trackingNumber && (
                <p className="text-gray-500 mt-1">Tracking Number: <span className="font-mono text-gray-800 font-bold">{order.trackingNumber}</span></p>
              )}
              {order.returnRequestStatus && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 mt-2 flex flex-col gap-0.5">
                  <span className="font-bold text-amber-800">Return Status: {order.returnRequestStatus}</span>
                  <span className="text-[10px] text-gray-500">Reason: {order.returnRequestReason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Table Items */}
          <div>
            <h3 className="font-bold text-gray-400 uppercase mb-3 tracking-wider flex items-center gap-1 text-xs">
              <Receipt className="w-3.5 h-3.5" /> Items Purchased
            </h3>
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold">
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Variant</th>
                    <th className="p-3.5 text-center">Qty</th>
                    <th className="p-3.5 text-right">Price</th>
                    <th className="p-3.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="p-3.5 font-bold text-gray-800">{item.name}</td>
                      <td className="p-3.5 text-gray-500">
                        {item.selectedVariant ? (
                          <div className="flex gap-1.5 flex-wrap">
                            {Object.entries(item.selectedVariant).map(([k, v]) => (
                              <span key={k} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600 capitalize">
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center font-bold text-gray-700">{item.quantity}</td>
                      <td className="p-3.5 text-right font-semibold text-gray-600">Rs. {item.price.toFixed(2)}</td>
                      <td className="p-3.5 text-right font-bold text-gray-800">Rs. {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="flex justify-end pt-4 border-t border-gray-100 text-xs md:text-sm">
            <div className="w-full max-w-sm space-y-3 font-semibold text-gray-500">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-gray-800 font-bold">Rs. {order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="text-gray-800 font-bold">Rs. {order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-gray-800 font-bold">
                  {order.shippingPrice === 0 ? "FREE" : `Rs. ${order.shippingPrice.toFixed(2)}`}
                </span>
              </div>
              {order.discountPrice > 0 && (
                <div className="flex justify-between text-[#2E7D32] bg-emerald-50/50 p-2 rounded-lg">
                  <span className="font-bold">Promo Coupon Discount ({order.couponCode})</span>
                  <span className="font-bold">- Rs. {order.discountPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-900 font-black text-base border-t border-gray-100 pt-3">
                <span>Grand Total Paid</span>
                <span className="text-[#2E7D32]">Rs. {order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Return Request Modal */}
      {showReturnModal && (
        <Modal
          title="Request Order Return"
          onClose={() => setShowReturnModal(false)}
        >
          <form onSubmit={handleReturnRequest} className="space-y-4">
            <p className="text-xs text-gray-500">
              Please let us know the reason for your return request. Upon approval, items will be refunded to your account.
            </p>
            <InputBox
              label="Return Reason"
              placeholder="e.g. Item damaged / expired / incorrect variant"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowReturnModal(false)} disabled={submittingReturn}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm" isLoading={submittingReturn}>
                Submit Request
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default OrderDetails;
