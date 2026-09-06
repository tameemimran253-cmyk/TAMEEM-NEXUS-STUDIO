import React, { useState, useMemo } from 'react';
import {
  Star,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Sparkles,
  Quote,
  ArrowUpRight,
  CheckCircle2,
  Send,
  X,
  PlusCircle,
  ThumbsUp,
  Building2,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CLIENT_REVIEWS, REVIEWS_STATS, ClientReview } from '../data/reviewsData';
import { audio } from '../utils/audioSystem';

interface ReviewsSectionProps {
  onOpenContact: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onOpenContact }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');
  const [reviewsList, setReviewsList] = useState<ClientReview[]>(CLIENT_REVIEWS);
  const [selectedReviewModal, setSelectedReviewModal] = useState<ClientReview | null>(null);
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);

  // Client Review Submission Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    name: '',
    role: '',
    company: '',
    category: 'Web Development' as ClientReview['category'],
    projectTitle: '',
    rating: 5,
    metricHighlight: '',
    reviewText: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ['All', 'Web Development', 'App Development', 'Software Automation', 'AI Solutions'];

  // Filter and Sort Logic
  const filteredReviews = useMemo(() => {
    return reviewsList
      .filter((rev) => {
        const matchesCat = selectedCategory === 'All' || rev.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          rev.clientName.toLowerCase().includes(q) ||
          rev.clientCompany.toLowerCase().includes(q) ||
          rev.projectTitle.toLowerCase().includes(q) ||
          rev.reviewText.toLowerCase().includes(q) ||
          rev.tags.some((t) => t.toLowerCase().includes(q));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0; // Natural chronological order
      });
  }, [reviewsList, selectedCategory, searchQuery, sortBy]);

  // When showAllReviews is false, display ONLY 2 reviews as requested
  const displayedReviews = useMemo(() => {
    if (showAllReviews) {
      return filteredReviews;
    }
    return filteredReviews.slice(0, 2);
  }, [filteredReviews, showAllReviews]);

  const handleCategorySelect = (cat: string) => {
    audio.playClick();
    setSelectedCategory(cat);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.name || !newReviewForm.reviewText) return;

    setIsSubmitting(true);
    audio.playClick();

    // Prepare new review object
    const createdReview: ClientReview = {
      id: `rev-${Date.now()}`,
      clientName: newReviewForm.name.trim(),
      clientRole: newReviewForm.role.trim() || 'Client Partner',
      clientCompany: newReviewForm.company.trim() || 'Independent Venture',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      rating: newReviewForm.rating,
      category: newReviewForm.category,
      projectTitle: newReviewForm.projectTitle.trim() || `${newReviewForm.category} Commission`,
      reviewDate: 'Just Now',
      verified: true,
      metricHighlight: newReviewForm.metricHighlight.trim() || 'Verified Client Submission',
      reviewText: newReviewForm.reviewText.trim(),
      tags: [newReviewForm.category, 'Client Feedback'],
    };

    // Save locally
    setReviewsList([createdReview, ...reviewsList]);

    // Send notification to admin email about new review submission
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newReviewForm.name,
          email: 'review_submission@tameemnexus.com',
          projectType: `[New Client Review] ${newReviewForm.category}`,
          budget: `${newReviewForm.rating} Stars Review`,
          timeline: newReviewForm.company || 'Verified Client',
          description: `Client Review Submission:\n\nRole: ${newReviewForm.role} @ ${newReviewForm.company}\nRating: ${newReviewForm.rating}/5\nProject: ${newReviewForm.projectTitle}\nMetric: ${newReviewForm.metricHighlight}\n\n"${newReviewForm.reviewText}"`,
        }),
      });
    } catch {
      // Non-blocking
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setNewReviewForm({
        name: '',
        role: '',
        company: '',
        category: 'Web Development',
        projectTitle: '',
        rating: 5,
        metricHighlight: '',
        reviewText: '',
      });
    }, 1800);
  };

  return (
    <section id="reviews" className="relative z-10 py-32 px-6 md:px-16 max-w-7xl mx-auto">
      {/* 1. Header & Section Eyebrow */}
      <div className="mb-14 space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono-code text-purple-300 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>CLIENT COMMENDATIONS &bull; 18+ VERIFIED REVIEWS</span>
        </div>

        <h2 className="text-4xl md:text-7xl font-serif-luxury font-light text-white leading-tight tracking-tight">
          GENUINE REVIEWS & TRUST.
        </h2>

        <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
          Honest feedback and performance metrics from technology executives, startup founders, and creative directors who commissioned Tameem Nexus Studio.
        </p>
      </div>

      {/* 2. High-Impact Trust & Delivery Stats Showcase */}
      <div className="mb-12 p-6 md:p-8 rounded-2xl glass-panel-glow border border-purple-500/30 grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
        {/* Metric 1: Average Rating */}
        <div className="space-y-1.5 border-r border-white/5 last:border-none">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-3xl md:text-4xl font-syne font-bold text-white block">
            {REVIEWS_STATS.averageRating}
            <span className="text-sm text-neutral-400 font-normal"> / 5.0</span>
          </span>
          <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-wider block">
            Average Client Rating
          </span>
        </div>

        {/* Metric 2: On-Time Delivery */}
        <div className="space-y-1.5 border-r border-white/5 last:border-none">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-mono-code text-emerald-400">Guaranteed</span>
          </div>
          <span className="text-3xl md:text-4xl font-syne font-bold text-white block">
            {REVIEWS_STATS.onTimeDeliveryRate}
          </span>
          <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-wider block">
            On-Time Milestone Delivery
          </span>
        </div>

        {/* Metric 3: Total Production Deployments */}
        <div className="space-y-1.5 border-r border-white/5 last:border-none">
          <div className="flex items-center justify-center gap-1.5 text-purple-400 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-mono-code text-purple-400">Production</span>
          </div>
          <span className="text-3xl md:text-4xl font-syne font-bold text-white block">
            {reviewsList.length}+
          </span>
          <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-wider block">
            Verified Reviews Logged
          </span>
        </div>

        {/* Metric 4: Client Retention */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-cyan-400 mb-1">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs font-mono-code text-cyan-400">Long-Term</span>
          </div>
          <span className="text-3xl md:text-4xl font-syne font-bold text-white block">
            {REVIEWS_STATS.clientRetentionRate}
          </span>
          <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-wider block">
            Client Retention & Referrals
          </span>
        </div>
      </div>

      {/* 3. Category Filter Tabs + Search & Action Bar */}
      <div className="mb-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? reviewsList.length
                : reviewsList.filter((r) => r.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                onMouseEnter={() => audio.playHover()}
                className={`px-4 py-2 rounded-full text-xs font-mono-code uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort, and Leave Review Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-9 pr-3.5 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60 transition-colors font-mono-code"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                &times;
              </button>
            )}
          </div>

          <button
            onClick={() => {
              audio.playClick();
              setIsSubmitModalOpen(true);
            }}
            onMouseEnter={() => audio.playHover()}
            className="px-4 py-2 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-mono-code uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">LEAVE A REVIEW</span>
            <span className="sm:hidden">REVIEW</span>
          </button>
        </div>
      </div>

      {/* 4. Reviews Grid (Bento Masonry Style) */}
      <div className={`grid grid-cols-1 ${showAllReviews ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 max-w-5xl mx-auto'} gap-6`}>
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            onClick={() => {
              audio.playClick();
              setSelectedReviewModal(review);
            }}
            onMouseEnter={() => audio.playHover()}
            className="p-7 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/40 hover:shadow-[0_10px_35px_rgba(168,85,247,0.15)] transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-pointer relative overflow-hidden"
          >
            {/* Top Row: Client Info & Avatar */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatarUrl}
                    alt={review.clientName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-purple-500/30 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-syne font-bold text-white group-hover:text-purple-300 transition-colors">
                        {review.clientName}
                      </h3>
                      {review.verified && (
                        <span title="Verified Client Review">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono-code text-neutral-400 block truncate max-w-[180px]">
                      {review.clientRole}
                    </span>
                    <span className="text-[10px] font-mono-code text-purple-400 block truncate max-w-[180px]">
                      {review.clientCompany}
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Project Title & Category Pill */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono-code text-neutral-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {review.category}
                  </span>
                  <span>{review.reviewDate}</span>
                </div>
                <h4 className="text-xs font-cinzel font-semibold text-purple-200">
                  {review.projectTitle}
                </h4>
              </div>

              {/* Metric Highlight (if present) */}
              {review.metricHighlight && (
                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono-code text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate">{review.metricHighlight}</span>
                </div>
              )}

              {/* Review Quote Text */}
              <div className="relative">
                <Quote className="w-5 h-5 text-purple-500/20 absolute -top-1 -left-1 rotate-180" />
                <p className="text-xs text-neutral-300 leading-relaxed font-light pl-4 italic line-clamp-4">
                  "{review.reviewText}"
                </p>
              </div>
            </div>

            {/* Bottom Row: Tags & Read Full Testimonial Link */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                {review.tags.slice(0, 3).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-[9px] font-mono-code text-neutral-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-mono-code text-purple-400 group-hover:text-purple-300 flex items-center gap-0.5 transition-colors shrink-0">
                <span>VIEW</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Reviews Button */}
      {filteredReviews.length > 2 && (
        <div className="mt-12 flex flex-col items-center justify-center gap-3">
          <button
            onClick={() => {
              audio.playClick();
              setShowAllReviews((prev) => !prev);
            }}
            onMouseEnter={() => audio.playHover()}
            className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-500/20 via-purple-600/30 to-purple-500/20 hover:from-purple-500/35 hover:via-purple-600/45 hover:to-purple-500/35 border border-purple-500/50 hover:border-purple-400 text-white font-syne font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_4px_25px_rgba(168,85,247,0.25)] hover:shadow-[0_8px_35px_rgba(168,85,247,0.45)] cursor-pointer group"
          >
            <span>
              {showAllReviews
                ? 'SHOW LESS (SHOWING 2 REVIEWS)'
                : `VIEW ALL REVIEWS (${filteredReviews.length})`}
            </span>
            {showAllReviews ? (
              <ChevronUp className="w-4 h-4 text-purple-300 group-hover:-translate-y-0.5 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 text-purple-300 group-hover:translate-y-0.5 transition-transform" />
            )}
          </button>
          {!showAllReviews && (
            <span className="text-[11px] font-mono-code text-neutral-400 tracking-wide">
              Showing 2 of {filteredReviews.length} verified reviews &bull; Click to expand all
            </span>
          )}
        </div>
      )}

      {/* 5. Bottom Invitation to Start a Commission */}
      <div className="mt-16 p-8 md:p-12 rounded-3xl glass-panel-glow border border-purple-500/30 text-center space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <span className="text-[10px] font-mono-code text-purple-400 uppercase tracking-widest block">
            READY FOR YOUR NEXT DIGITAL FLAGSHIP?
          </span>
          <h3 className="text-2xl md:text-4xl font-serif-luxury text-white">
            Join the founders and engineering leads building with Tameem Nexus Studio.
          </h3>
          <p className="text-xs md:text-sm text-neutral-300 max-w-xl mx-auto font-light">
            We review project inquiries within 24 to 48 hours and provide detailed architectural roadmaps and milestone projections.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              audio.playClick();
              onOpenContact();
            }}
            onMouseEnter={() => audio.playHover()}
            className="px-8 py-3.5 rounded-full bg-white text-black font-syne font-bold text-xs uppercase tracking-widest hover:bg-[#a855f7] hover:text-white transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2 cursor-pointer"
          >
            <span>START A COMMISSION</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              audio.playClick();
              setIsSubmitModalOpen(true);
            }}
            onMouseEnter={() => audio.playHover()}
            className="px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono-code text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>SUBMIT CLIENT FEEDBACK</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          6. MODAL: DETAILED REVIEW MODAL
          ======================================================== */}
      {selectedReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl glass-panel-glow border border-purple-500/40 p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReviewModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 pr-10">
              <img
                src={selectedReviewModal.avatarUrl}
                alt={selectedReviewModal.clientName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover border border-purple-500/40"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-syne font-bold text-white">
                    {selectedReviewModal.clientName}
                  </h3>
                  {selectedReviewModal.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono-code text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Commission
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono-code text-neutral-400">
                  {selectedReviewModal.clientRole} &bull;{' '}
                  <span className="text-purple-300">{selectedReviewModal.clientCompany}</span>
                </p>
                <div className="flex items-center gap-1 text-amber-400 pt-1">
                  {[...Array(selectedReviewModal.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[11px] font-mono-code text-neutral-400 ml-2">
                    {selectedReviewModal.reviewDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Box */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
              <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest block">
                COMMISSIONED PROJECT
              </span>
              <div className="text-sm font-cinzel font-semibold text-white">
                {selectedReviewModal.projectTitle}
              </div>
              {selectedReviewModal.metricHighlight && (
                <div className="text-xs font-mono-code text-purple-300 flex items-center gap-2 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{selectedReviewModal.metricHighlight}</span>
                </div>
              )}
            </div>

            {/* Full Review Text */}
            <div className="p-5 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest block">
                FULL TESTIMONIAL
              </span>
              <p className="text-sm text-neutral-200 leading-relaxed font-light italic">
                "{selectedReviewModal.reviewText}"
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedReviewModal.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono-code text-neutral-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReviewModal(null)}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-mono-code text-white uppercase tracking-wider transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. MODAL: SUBMIT CLIENT REVIEW
          ======================================================== */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel-glow border border-purple-500/40 p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>COMMISSION FEEDBACK</span>
              </div>
              <h3 className="text-2xl font-cinzel text-white">Share Your Review</h3>
              <p className="text-xs text-neutral-400 font-light">
                Submit your experience with Tameem Nexus Studio. Your review will be published to our verified feedback registry.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-cinzel text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs text-neutral-300 font-light">
                  Your review has been successfully registered and added to our commendations.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-mono-code">
                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-neutral-400 block text-[10px] uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={newReviewForm.name}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
                      placeholder="e.g. Zeeshan Khan / Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-neutral-400 block text-[10px] uppercase">Your Role</label>
                    <input
                      type="text"
                      value={newReviewForm.role}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, role: e.target.value })}
                      placeholder="e.g. CTO / Product Lead"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60"
                    />
                  </div>
                </div>

                {/* Company & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-neutral-400 block text-[10px] uppercase">Company / Venture</label>
                    <input
                      type="text"
                      value={newReviewForm.company}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, company: e.target.value })}
                      placeholder="e.g. Nexus Dynamics"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-neutral-400 block text-[10px] uppercase">Category</label>
                    <select
                      value={newReviewForm.category}
                      onChange={(e) =>
                        setNewReviewForm({
                          ...newReviewForm,
                          category: e.target.value as ClientReview['category'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#121018] border border-white/10 text-white focus:outline-none focus:border-purple-500/60 cursor-pointer"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="App Development">App Development</option>
                      <option value="Software Automation">Software Automation</option>
                      <option value="AI Solutions">AI Solutions</option>
                    </select>
                  </div>
                </div>

                {/* Project Title & Metric */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-neutral-400 block text-[10px] uppercase">Project Title</label>
                    <input
                      type="text"
                      value={newReviewForm.projectTitle}
                      onChange={(e) =>
                        setNewReviewForm({ ...newReviewForm, projectTitle: e.target.value })
                      }
                      placeholder="e.g. WebGL 3D Platform"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-neutral-400 block text-[10px] uppercase">Key Metric / Result</label>
                    <input
                      type="text"
                      value={newReviewForm.metricHighlight}
                      onChange={(e) =>
                        setNewReviewForm({ ...newReviewForm, metricHighlight: e.target.value })
                      }
                      placeholder="e.g. +200% Conversion"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60"
                    />
                  </div>
                </div>

                {/* Rating Select */}
                <div className="space-y-1">
                  <label className="text-neutral-400 block text-[10px] uppercase">Star Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setNewReviewForm({ ...newReviewForm, rating: num })}
                        className="p-1 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            num <= newReviewForm.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-neutral-300 ml-2">{newReviewForm.rating} of 5 Stars</span>
                  </div>
                </div>

                {/* Review Message */}
                <div className="space-y-1">
                  <label className="text-neutral-400 block text-[10px] uppercase">Testimonial *</label>
                  <textarea
                    required
                    rows={4}
                    value={newReviewForm.reviewText}
                    onChange={(e) =>
                      setNewReviewForm({ ...newReviewForm, reviewText: e.target.value })
                    }
                    placeholder="Share your detailed feedback regarding code quality, communication, aesthetics, and delivery speed..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60 leading-relaxed font-light"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-syne font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'SUBMITTING...' : 'PUBLISH REVIEW'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
