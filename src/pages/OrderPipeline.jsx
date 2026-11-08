import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  Columns,
  Layers,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Send,
  RefreshCw,
} from 'lucide-react';

export default function OrderPipeline({
  orders,
  stages,
  pipelineSearch,
  setPipelineSearch,
  pipelineDayFilter,
  setPipelineDayFilter,
  autoWhatsappOnMove,
  setAutoWhatsappOnMove,
  pipelineLayoutJugaad,
  setPipelineLayoutJugaad,
  pipelineFullScreen,
  setPipelineFullScreen,
  stagePageMap,
  setStagePageMap,
  expandedOrderItems,
  setExpandedOrderItems,
  moveOrderStage,
  sendWhatsAppNotification,
  onRefresh,
  isLoading,
}) {
  const [mobileSelectedStage, setMobileSelectedStage] = React.useState('all');

  const displayedStages = mobileSelectedStage === 'all'
    ? stages
    : stages.filter((s) => s.id === mobileSelectedStage);
  return (
    <motion.div
      key="pipeline"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className={`space-y-4 ${pipelineFullScreen ? 'h-full flex flex-col' : ''}`}
    >
      {/* Pipeline Top Controls Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-1">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={pipelineSearch}
              onChange={(e) => setPipelineSearch(e.target.value)}
              placeholder="Search order, customer..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto max-w-full">
            {['All', 'Today', 'Yesterday', '2 Days Ago'].map((dayLabel) => (
              <button
                key={dayLabel}
                onClick={() => setPipelineDayFilter(dayLabel)}
                className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap text-xs ${
                  pipelineDayFilter === dayLabel
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dayLabel === 'All' ? 'All Days' : dayLabel}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoWhatsappOnMove}
              onChange={(e) => setAutoWhatsappOnMove(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-bold text-emerald-900">Auto-WhatsApp</span>
          </label>
        </div>

        {/* Right: Smart Views & Full Screen Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setPipelineLayoutJugaad('auto_grid')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                pipelineLayoutJugaad === 'auto_grid' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600'
              }`}
              title="Smart 2x2 Grid for multi-order stages"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>2x2 Grid</span>
            </button>
            <button
              onClick={() => setPipelineLayoutJugaad('compact_deck')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                pipelineLayoutJugaad === 'compact_deck' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600'
              }`}
              title="6-Col Deck with mini pagination"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>6-Col Deck</span>
            </button>
            <button
              onClick={() => setPipelineLayoutJugaad('split_3x2')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                pipelineLayoutJugaad === 'split_3x2' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600'
              }`}
              title="3x2 Split View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3x2 Split</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 disabled:opacity-50"
                title="Refresh Pipeline Orders from Database"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            )}

            <button
              onClick={() => setPipelineFullScreen(!pipelineFullScreen)}
              className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                pipelineFullScreen ? 'bg-amber-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
              title={pipelineFullScreen ? 'Exit Full Screen (Esc)' : 'Expand to Full Screen'}
            >
              {pipelineFullScreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Exit Full</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Full Screen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE STAGE QUICK SELECTOR TABS (< md) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setMobileSelectedStage('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition shrink-0 ${
            mobileSelectedStage === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          <span>All Stages</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            mobileSelectedStage === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {orders.length}
          </span>
        </button>

        {stages.map((stg) => {
          const StgIcon = stg.icon;
          const count = orders.filter((o) => o.stage === stg.id).length;
          const isSel = mobileSelectedStage === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => setMobileSelectedStage(stg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition shrink-0 border ${
                isSel
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200/90'
              }`}
            >
              <StgIcon className="w-3.5 h-3.5" />
              <span>{stg.shortLabel || stg.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSel ? 'bg-white text-sky-700 font-extrabold' : 'bg-slate-100 text-slate-700 font-semibold'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* PIPELINE BOARD CONTAINER */}
      <div
        className={`grid gap-3.5 items-start ${
          pipelineFullScreen ? 'flex-1 overflow-y-auto pb-6' : ''
        } ${
          mobileSelectedStage !== 'all'
            ? 'grid-cols-1'
            : pipelineLayoutJugaad === 'compact_deck'
            ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
            : pipelineLayoutJugaad === 'split_3x2'
            ? 'grid-cols-1 lg:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-12'
        }`}
      >
        {displayedStages.map((stage) => {
          const stageIdx = stages.findIndex((s) => s.id === stage.id);
          const StageIcon = stage.icon;
          const stageOrders = orders.filter((o) => {
            const matchesStage = o.stage === stage.id;
            const matchesDay = pipelineDayFilter === 'All' || o.dayCategory === pipelineDayFilter;
            const matchesQuery =
              o.id.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
              o.customerName.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
              o.customerPhone.includes(pipelineSearch);
            return matchesStage && matchesDay && matchesQuery;
          });

          const isCrowdedStage = stageOrders.length >= 3;
          const autoGridColSpan = isCrowdedStage ? 'lg:col-span-4' : 'lg:col-span-2';
          const useInternalTwoColGrid =
            (pipelineLayoutJugaad === 'auto_grid' && isCrowdedStage) || pipelineLayoutJugaad === 'split_3x2';

          const PAGE_SIZE = 3;
          const totalPages = Math.max(1, Math.ceil(stageOrders.length / PAGE_SIZE));
          const currentPage = Math.min(stagePageMap[stage.id] || 0, totalPages - 1);
          const visibleOrders =
            pipelineLayoutJugaad === 'compact_deck' && stageOrders.length > PAGE_SIZE
              ? stageOrders.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)
              : stageOrders;

          return (
            <div
              key={stage.id}
              className={`bg-slate-100/90 rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 flex flex-col transition-all ${
                pipelineLayoutJugaad === 'auto_grid' ? autoGridColSpan : ''
              }`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between px-1.5 py-1 mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg ${stage.badgeBg} text-white flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <StageIcon className="w-3.5 h-3.5" />
                  </span>
                  <div className="truncate">
                    <h3 className="font-bold text-xs text-slate-900 truncate">{stage.label}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {pipelineLayoutJugaad === 'compact_deck' && stageOrders.length > PAGE_SIZE && (
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg px-1 py-0.5 text-[10px] font-bold text-slate-700 mr-1">
                      <button
                        onClick={() =>
                          setStagePageMap((prev) => ({ ...prev, [stage.id]: Math.max(0, currentPage - 1) }))
                        }
                        disabled={currentPage === 0}
                        className="px-1 disabled:opacity-30 hover:text-sky-600"
                      >
                        ‹
                      </button>
                      <span>
                        {currentPage + 1}/{totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setStagePageMap((prev) => ({
                            ...prev,
                            [stage.id]: Math.min(totalPages - 1, currentPage + 1),
                          }))
                        }
                        disabled={currentPage >= totalPages - 1}
                        className="px-1 disabled:opacity-30 hover:text-sky-600"
                      >
                        ›
                      </button>
                    </div>
                  )}

                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200 shadow-2xs">
                    {stageOrders.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className={`grid gap-2.5 ${useInternalTwoColGrid ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                <AnimatePresence>
                  {visibleOrders.map((ord) => {
                    const totalItemsCount = ord.items.reduce((sum, i) => sum + i.qty, 0);
                    const isExpanded = !!expandedOrderItems[ord.id];

                    return (
                      <motion.div
                        layout
                        key={ord.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300/80 transition flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
                              #{ord.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                ord.dayCategory === 'Today'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : ord.dayCategory === 'Yesterday'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {ord.dayCategory}
                            </span>
                          </div>

                          <div className="mt-1.5 flex items-baseline justify-between gap-1">
                            <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">{ord.customerName}</p>
                            <span className="text-[10px] font-bold text-slate-500 shrink-0">{totalItemsCount} pcs/kg</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 truncate">{ord.customerPhone}</p>

                          <div className="mt-2 pt-2 border-t border-slate-100">
                            {(isExpanded ? ord.items : ord.items.slice(0, 2)).map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px] font-semibold text-slate-700 py-0.5"
                              >
                                <span className="truncate pr-1.5">• {it.name}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 shrink-0">
                                  {it.qty} {it.unit.replace('per ', '')}
                                </span>
                              </div>
                            ))}
                            {ord.items.length > 2 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedOrderItems((prev) => ({ ...prev, [ord.id]: !isExpanded }))
                                }
                                className="text-[10px] font-bold text-sky-600 hover:underline mt-0.5"
                              >
                                {isExpanded ? 'Show less' : `+${ord.items.length - 2} more service`}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                            <span className="truncate">
                              Due: <strong className="text-slate-700">{ord.expectedDelivery}</strong>
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold shrink-0">
                              {ord.notifyCount}x alert
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 pt-0.5">
                            <button
                              disabled={stageIdx === 0}
                              onClick={() => moveOrderStage(ord.id, -1)}
                              className="p-2 sm:p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-600 transition shrink-0"
                              title="Move Back"
                            >
                              <ChevronLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            </button>

                            <button
                              onClick={() => sendWhatsAppNotification(ord, ord.stage)}
                              className="flex-1 py-2 sm:py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs sm:text-[11px] flex items-center justify-center gap-1 transition"
                            >
                              <Send className="w-3.5 h-3.5 sm:w-3 sm:h-3" /> Update
                            </button>

                            <button
                              disabled={stageIdx === stages.length - 1}
                              onClick={() => moveOrderStage(ord.id, 1)}
                              className="py-2 sm:py-1.5 px-3 sm:px-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white font-bold text-xs sm:text-[11px] flex items-center gap-0.5 transition shadow-2xs"
                            >
                              Next <ChevronRight className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {stageOrders.length === 0 && (
                  <div className="col-span-full h-24 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-[11px] font-semibold text-slate-400">
                    No orders in {stage.shortLabel}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

