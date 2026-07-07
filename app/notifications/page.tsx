"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type { Notification, NotificationType } from "@/lib/supabase/types";
import NotificationCard from "@/components/NotificationCard";
import { FaSearch, FaFilter, FaCheckCircle, FaTrash, FaSpinner, FaBell } from "react-icons/fa";
import toast from "react-hot-toast";

const TYPES: { value: NotificationType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "order_update", label: "Order Updates" },
  { value: "payment_status", label: "Payment Status" },
  { value: "promotion", label: "Promotions" },
  { value: "system_alert", label: "System Alerts" },
];

const NotificationsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setItems((data ?? []) as Notification[]);
      setLoading(false);
    })();
  }, [user, supabase]);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (typeFilter !== "all" && n.type !== typeFilter) return false;
      if (readFilter === "read" && !n.is_read) return false;
      if (readFilter === "unread" && n.is_read) return false;
      if (search) {
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, typeFilter, readFilter, search]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markRead = async (id: string) => {
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    if (error) toast.error(error.message);
    else setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this notification?")) return;
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllSelectedAsRead = async () => {
    if (selected.size === 0) return;
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", Array.from(selected));
    if (error) toast.error(error.message);
    else {
      setItems((prev) => prev.map((n) => (selected.has(n.id) ? { ...n, is_read: true } : n)));
      setSelected(new Set());
      toast.success("Marked as read");
    }
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} notification(s)?`)) return;
    const { error } = await supabase.from("notifications").delete().in("id", Array.from(selected));
    if (error) toast.error(error.message);
    else {
      setItems((prev) => prev.filter((n) => !selected.has(n.id)));
      setSelected(new Set());
      toast.success("Deleted");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FaBell className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
          </div>
          <p className="text-gray-600">Manage and view all your notifications in one place</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="mb-4"
          >
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </form>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as NotificationType | "all")}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value as "all" | "read" | "unread")}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setReadFilter("all");
              }}
              className="px-3 py-1 text-sm text-gray-600 underline"
            >
              Clear
            </button>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-blue-700">{selected.size} selected</span>
            <div className="flex space-x-3">
              <button
                onClick={markAllSelectedAsRead}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md"
              >
                <FaCheckCircle className="w-4 h-4 mr-1" /> Mark as read
              </button>
              <button
                onClick={deleteSelected}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md"
              >
                <FaTrash className="w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-3xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You don&apos;t have any notifications yet.</p>
            </div>
          ) : (
            filtered.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                isSelected={selected.has(n.id)}
                onToggleSelect={toggle}
                onMarkAsRead={markRead}
                onDelete={remove}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
