import Sidebar from "../components/sidebar"
import Header from "../components/header"
import { useState } from "react"
import { Wallet, CheckCircle2, Clock, XCircle, CreditCard, Building2, Smartphone, X, Download, Printer, Receipt, AlertCircle, Sparkles, ArrowRight,} from "lucide-react"
const totalFees = 450000
const amountPaid = 300000
const outstanding = totalFees - amountPaid
const feeBreakdown = [
  { desc: "Tuition Fee", amount: 300000, status: "Paid" },
  { desc: "Registration Fee", amount: 25000, status: "Paid" },
  { desc: "Library Fee", amount: 15000, status: "Paid" },
  { desc: "ICT Fee", amount: 20000, status: "Paid" },
  { desc: "Examination Fee", amount: 25000, status: "Unpaid" },
  { desc: "Student Development Fee", amount: 15000, status: "Unpaid" },
]

const paymentHistory = [
  { date: "Aug 05, 2026", desc: "Tuition Fee", ref: "EDU-PAY-84291", amount: 200000, status: "Successful", method: "Card" },
  { date: "Jul 28, 2026", desc: "Registration Fee", ref: "EDU-PAY-81342", amount: 100000, status: "Successful", method: "Bank Transfer" },
  { date: "Jul 20, 2026", desc: "ICT Fee", ref: "EDU-PAY-79821", amount: 20000, status: "Successful", method: "USSD" },
]

const naira = (n: number) => `₦${n.toLocaleString()}`

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; icon: any }> = {
    Successful: { bg: "bg-green-50", text: "text-green-600", icon: CheckCircle2 },
    Paid: { bg: "bg-green-50", text: "text-green-600", icon: CheckCircle2 },
    Pending: { bg: "bg-amber-50", text: "text-amber-600", icon: Clock },
    Unpaid: { bg: "bg-red-50", text: "text-red-500", icon: XCircle },
    Failed: { bg: "bg-red-50", text: "text-red-500", icon: XCircle },
  }
  const s = map[status] ?? map.Pending
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <Icon size={12} strokeWidth={2.5} />
      {status}
    </span>
  )
}
const paymentMethods = [
  { label: "Card", icon: CreditCard },
  { label: "Bank Transfer", icon: Building2 },
  { label: "USSD", icon: Smartphone },
]

function PaymentModal({ amount, onClose }: { amount: number; onClose: () => void }) {
  const [method, setMethod] = useState("Card")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)
    }, 1400)
  }

    return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            {success ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={30} strokeWidth={1.75} className="text-green-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-black mb-1">Payment Successful</h3>
                <p className="text-sm text-black/55 mb-6">{naira(amount)} has been received.</p>
                <button
                  onClick={onClose}
                  className="w-full bg-[#14263F] text-white text-sm font-semibold py-3 rounded-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-[#0B1524] to-[#1E3A8A] px-6 py-6 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">Payment Amount</p>
                    <p className="font-serif text-white text-3xl font-semibold mt-1">{naira(amount)}</p>
                  </div>
                  <button onClick={onClose} className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-3">Payment Method</p>
                  <div className="flex flex-col gap-2 mb-6">
                    {paymentMethods.map((m, i) => {
                      const Icon = m.icon
                      const active = method === m.label
                      return (
                        <button
                          key={i}
                          onClick={() => setMethod(m.label)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                            active ? "border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A]" : "border-black/10 text-black/60 hover:border-black/20"
                          }`}
                        >
                          <Icon size={18} strokeWidth={1.75} />
                          {m.label}
                          {active && <CheckCircle2 size={16} className="ml-auto text-[#1E3A8A]" />}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={handlePay}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60"
                  >
                    {processing ? "Processing..." : "Proceed to Payment"}
                    {!processing && <ArrowRight size={16} />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
    )
  }

  function ReceiptModal({ payment, onClose }: { payment: typeof paymentHistory[number]; onClose: () => void }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-[#0B1524] to-[#1E3A8A] px-6 py-6 flex items-start justify-between">
            <div>
              <p className="font-serif text-white text-lg font-semibold">EduNova University</p>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#B8901F] mt-1">Official Payment Receipt</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-3 pb-5 mb-5 border-b border-dashed border-black/15">
              {[
                { label: "Student Name", value: "Edwin Adeyi-Samuel" },
                { label: "Student ID", value: "EDU/2026/UG/001245" },
                { label: "Programme", value: "B.Eng. Mechanical Engineering" },
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-black/50">{row.label}</span>
                  <span className="font-medium text-black text-right">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 pb-5 mb-5 border-b border-dashed border-black/15">
              {[
                { label: "Payment Reference", value: payment.ref },
                { label: "Payment Date", value: payment.date },
                { label: "Payment Method", value: payment.method },
                { label: "Description", value: payment.desc },
                { label: "Academic Session", value: "2026/2027" },
                { label: "Semester", value: "First Semester" },
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-black/50">{row.label}</span>
                  <span className="font-medium text-black text-right">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm font-medium text-black/70">Amount Paid</span>
              <span className="font-serif text-2xl font-semibold text-[#1E3A8A]">{naira(payment.amount)}.00</span>
            </div>

            <div className="flex justify-center mb-6">
              <StatusBadge status={payment.status} />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#14263F] text-white text-sm font-medium py-3 rounded-xl hover:-translate-y-0.5 transition-all duration-300">
                <Download size={16} /> Download
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-black/10 text-black/70 text-sm font-medium py-3 rounded-xl hover:bg-black/[0.03] transition-colors">
                <Printer size={16} /> Print
              </button>
            </div>

            <p className="text-center text-[11px] text-black/35 mt-6 pt-4 border-t border-black/5">
              EduNova University · Bursary Department
            </p>
          </div>
        </div>
      </div>
    )
  }

  export default function Fees() {
    const [tab, setTab] = useState<"overview" | "history" | "receipts">("overview")
    const [showPayment, setShowPayment] = useState(false)
    const [receiptFor, setReceiptFor] = useState<typeof paymentHistory[number] | null>(null)

    const fullyPaid = outstanding <= 0

    return (
        <div className="flex">
          <aside className="hidden lg:block w-72">
            <div className="sticky top-0 h-screen">
              <Sidebar />
            </div>
          </aside>
          <div className="flex-1">
            <Header />
            <div className="bg-[#F6F6F2] min-h-screen">
            <div className="relative bg-gradient-to-br from-[#0B1524] via-[#14263F] to-[#1E3A8A] overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#B8901F]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="relative px-4 md:px-8 py-10 max-w-5xl mx-auto">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] uppercase text-[#B8901F] mb-3">
                  <Sparkles size={13} /> Bursary
                </span>
                <h1 className="font-serif text-white text-3xl md:text-4xl font-semibold">Fees & Payments</h1>
                <p className="font-sans text-white/70 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
                  View your current fees, payment status, and transaction history.
                </p>

                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                    <p className="text-white/50 text-xs mb-2">Total Fees</p>
                    <p className="font-serif text-white text-xl font-semibold">{naira(totalFees)}</p>
                  </div>
                  <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                    <p className="text-white/50 text-xs mb-2">Amount Paid</p>
                    <p className="font-serif text-green-400 text-xl font-semibold">{naira(amountPaid)}</p>
                  </div>
                  <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                    <p className="text-white/50 text-xs mb-2">Outstanding</p>
                    <p className={`font-serif text-xl font-semibold ${fullyPaid ? "text-green-400" : "text-[#B8901F]"}`}>
                      {fullyPaid ? "₦0.00" : naira(outstanding)}
                    </p>
                  </div>
                  <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                    <p className="text-white/50 text-xs mb-2">Payment Status</p>
                    {fullyPaid ? (
                      <p className="flex items-center gap-1.5 font-serif text-green-400 text-lg font-semibold">
                        <CheckCircle2 size={18} /> Fully Paid
                      </p>
                    ) : (
                      <p className="font-serif text-amber-400 text-lg font-semibold">Partially Paid</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto flex flex-col gap-6 -mt-2">

              {/* Tabs */}
              <div className="flex gap-1 bg-white rounded-full p-1 border border-black/5 w-fit shadow-sm">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "history", label: "Payment History" },
                  { key: "receipts", label: "Receipts" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key as typeof tab)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      tab === t.key ? "bg-[#14263F] text-white" : "text-black/55 hover:text-black"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* OVERVIEW TAB */}
              {tab === "overview" && (
                <>
                  <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between flex-wrap gap-2">
                      <h5 className="font-serif text-lg font-semibold text-black">Current Session Fees</h5>
                      <p className="font-mono text-xs text-black/40">2026/2027 · First Semester</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-black/5 bg-black/[0.015]">
                            <th className="text-left font-mono text-[10px] tracking-wide uppercase text-black/40 px-6 py-3">Fee Description</th>
                            <th className="text-left font-mono text-[10px] tracking-wide uppercase text-black/40 px-6 py-3">Amount</th>
                            <th className="text-left font-mono text-[10px] tracking-wide uppercase text-black/40 px-6 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeBreakdown.map((fee, i) => (
                            <tr key={i} className="border-b border-black/5 last:border-b-0">
                              <td className="px-6 py-3.5 font-medium text-black">{fee.desc}</td>
                              <td className="px-6 py-3.5 text-black/70">{naira(fee.amount)}</td>
                              <td className="px-6 py-3.5"><StatusBadge status={fee.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-black/[0.02]">
                            <td className="px-6 py-3.5 font-semibold text-black text-sm">Total</td>
                            <td className="px-6 py-3.5 font-semibold text-black text-sm">{naira(totalFees)}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Make payment */}
                  {!fullyPaid && (
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#B8901F] to-[#96731a] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                      <div>
                        <p className="text-white/80 text-xs font-mono uppercase tracking-widest mb-1">Outstanding Balance</p>
                        <p className="font-serif text-white text-3xl font-semibold">{naira(outstanding)}</p>
                      </div>
                      <button
                        onClick={() => setShowPayment(true)}
                        className="flex items-center justify-center gap-2 bg-white text-[#14263F] text-sm font-semibold px-6 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                      >
                        <Wallet size={16} /> Make Payment
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* HISTORY TAB */}
              {tab === "history" && (
                <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="px-6 py-5 border-b border-black/5">
                    <h5 className="font-serif text-lg font-semibold text-black">Payment History</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-black/5 bg-black/[0.015]">
                          {["Date", "Description", "Reference", "Amount", "Status", ""].map((h) => (
                            <th key={h} className="text-left font-mono text-[10px] tracking-wide uppercase text-black/40 px-6 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((p, i) => (
                          <tr key={i} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.015] transition-colors">
                            <td className="px-6 py-3.5 text-black/60">{p.date}</td>
                            <td className="px-6 py-3.5 font-medium text-black">{p.desc}</td>
                            <td className="px-6 py-3.5 font-mono text-xs text-black/50">{p.ref}</td>
                            <td className="px-6 py-3.5 text-black/75">{naira(p.amount)}</td>
                            <td className="px-6 py-3.5"><StatusBadge status={p.status} /></td>
                            <td className="px-6 py-3.5">
                              <button
                                onClick={() => setReceiptFor(p)}
                                className="text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap"
                              >
                                View Receipt
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* RECEIPTS TAB */}
              {tab === "receipts" && (
                <div className="flex flex-col gap-4">
                  <h5 className="font-serif text-lg font-semibold text-black">Payment Receipts</h5>
                  {paymentHistory.map((p, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-black/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                          <Receipt size={20} strokeWidth={1.75} className="text-[#1E3A8A]" />
                        </div>
                        <div>
                          <p className="font-mono text-xs text-black/40">{p.ref}</p>
                          <p className="font-serif font-semibold text-black">{p.desc}</p>
                          <p className="text-xs text-black/50 mt-0.5">{p.date} · {naira(p.amount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <StatusBadge status={p.status} />
                        <button
                          onClick={() => setReceiptFor(p)}
                          className="text-sm font-medium text-[#1E3A8A] border border-[#1E3A8A]/20 px-4 py-2 rounded-lg hover:bg-[#1E3A8A]/5 transition-colors"
                        >
                          View Receipt
                        </button>
                        <button className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#14263F] px-4 py-2 rounded-lg hover:-translate-y-0.5 transition-all duration-300">
                          <Download size={14} /> PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notice */}
              <div className="flex items-start gap-3 bg-[#1E3A8A]/[0.04] border border-[#1E3A8A]/10 rounded-2xl p-5">
                <AlertCircle size={18} strokeWidth={1.75} className="text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-black/60 leading-relaxed">
                  <span className="font-medium text-black/80">Payment Notice:</span> Always verify that the payment reference and amount are correct before completing a transaction. Keep your receipt for future reference.
                </p>
              </div>
            </div>

            {showPayment && <PaymentModal amount={outstanding} onClose={() => setShowPayment(false)} />}
            {receiptFor && <ReceiptModal payment={receiptFor} onClose={() => setReceiptFor(null)} />}
          </div>
          </div>
        </div>
    )
  }