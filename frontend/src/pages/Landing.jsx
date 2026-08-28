import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Clock, ShieldCheck, TrendingUp, AlertTriangle, ArrowRight, CheckCircle, Smartphone, Award, BarChart2 } from 'lucide-react';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-emerald-gradient text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/20">
              <Award className="w-4 h-4 text-amber-300" /> SIH Problem ID: 26032 | DoCA
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 leading-tight">
              Kisan<span className="text-emerald-300">Q</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-emerald-100 mt-2">
              Book. Track. Procure. Without the Wait.
            </p>
            <p className="text-slate-100 mt-4 leading-relaxed text-base max-w-xl">
              Book your procurement slot, track your queue in real time, and monitor procurement and payment status without unnecessary waiting at overcrowded centres.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-white text-emerald-900 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-2"
              >
                <Sprout className="w-5 h-5 text-emerald-600" />
                Book a Slot
              </Link>
              <Link
                to="/login"
                className="bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold px-6 py-3.5 rounded-xl border border-emerald-400/30 transition-all flex items-center gap-2"
              >
                Login to Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-white/20 shadow-2xl">
            <div className="bg-white text-slate-900 rounded-xl p-5 shadow-md">
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Live Queue Token</span>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Waiting</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-slate-500">Your Token</p>
                  <p className="text-4xl font-extrabold text-emerald-700">A124</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Currently Serving</p>
                  <p className="text-2xl font-bold text-slate-800">A120</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t text-xs">
                <div>
                  <p className="text-slate-500">Farmers Ahead</p>
                  <p className="text-sm font-bold text-slate-800">3 Farmers</p>
                </div>
                <div>
                  <p className="text-slate-500">Est. Wait Time</p>
                  <p className="text-sm font-bold text-emerald-600">24 Minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            The Existing Challenge
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Why Farmers Need KisanQ</h2>
          <p className="text-slate-600 mt-2">Existing manual procurement processes create immense physical and financial stress for farmers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { title: 'Long Waiting Times', desc: 'Farmers spend hours or full days standing in unorganized lines.' },
            { title: 'Crowded Procurement Centres', desc: 'Overcrowding leads to chaos, congestion, and logistical bottlenecks.' },
            { title: 'Schedule Uncertainty', desc: 'Lack of prior slot schedules forces unnecessary daily travel.' },
            { title: 'No Real-Time Queue Info', desc: 'No visibility into when an individual turn will arrive.' },
            { title: 'Difficult Procurement Tracking', desc: 'Opaque weight and quality recordings lead to uncertainty.' },
            { title: 'Uncertain Payment Status', desc: 'Farmers wait endlessly without clear transaction status updates.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-rose-200 transition-all">
              <AlertTriangle className="w-6 h-6 text-rose-500 mb-3" />
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution Workflow */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The Smart KisanQ Solution
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">End-to-End Digital Workflow</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-12 text-center">
            {[
              { step: '1', title: 'Register', desc: 'Create farmer profile' },
              { step: '2', title: 'Book Slot', desc: 'Choose centre & time' },
              { step: '3', title: 'Get Token', desc: 'Receive digital token' },
              { step: '4', title: 'Track Queue', desc: 'Monitor wait remotely' },
              { step: '5', title: 'Procurement', desc: 'Record weight & grade' },
              { step: '6', title: 'Track Payment', desc: 'Direct transaction status' },
            ].map((st, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-2">
                  {st.step}
                </div>
                <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900">Key Benefits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Clock, title: 'Reduced Waiting Time', desc: 'Reach the procurement centre only when your turn approaches.' },
            { icon: TrendingUp, title: 'Less Congestion', desc: 'Distributes crop arrivals evenly across timed daily slots.' },
            { icon: Smartphone, title: 'Real-Time Queue', desc: 'Track current token, farmers ahead, and estimated wait minutes from mobile.' },
            { icon: ShieldCheck, title: 'Transparent Procurement', desc: 'Instant digital record of actual weight, crop rate, and total amount.' },
            { icon: CheckCircle, title: 'Payment Tracking', desc: 'Real-time visibility into payment processing and completion.' },
            { icon: BarChart2, title: 'Better Centre Management', desc: 'Operators and administrators gain overall daily operational analytics.' },
          ].map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{b.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
