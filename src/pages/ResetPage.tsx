/**
 * @file RecoverPasswordPage.tsx
 * @description This page allows users to request a password reset link by entering their email address. 
 * It integrates with the backend API endpoint `/auth/reset-password` to initiate the recovery process.
 * 
 * @component
 * @example
 * return (
 *   <RecoverPasswordPage />
 * )
 * 
 * @module RecoverPasswordPage
 * 
 * @accessibility
 * ✅ **WCAG 2.1 Compliance Summary**
 * 
 * - **Perceivable**
 *   - Text and background maintain a contrast ratio > 4.5:1.
 *   - All interactive elements (inputs, buttons) have visible focus states.
 *   - Placeholder text and labels are distinct and readable.
 * 
 * - **Operable**
 *   - Fully operable via keyboard navigation (Tab / Enter).
 *   - Clear visual feedback for focus on form fields and buttons.
 *   - Buttons use `<button>` semantic elements for proper accessibility.
 * 
 * - **Understandable**
 *   - Clear language and step-by-step feedback on actions.
 *   - Validation messages describe the specific error.
 *   - ARIA roles not required due to semantic HTML.
 * 
 * - **Robust**
 *   - Compatible with screen readers and modern browsers.
 *   - Follows standard form and input semantics.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Services/AuthService";
import { Navbar } from "../components/Navbar";
import { Loader2 } from "lucide-react";

/**
 * @function RecoverPasswordPage
 * @description Renders the password recovery page where users can input their email to receive a reset link.
 * 
 * @returns {JSX.Element} The rendered React component.
 */
const RecoverPasswordPage: React.FC = () => {
  /** 
   * @state {string} email - Stores the user’s email input.
   * @state {string | null} message - Displays success or error messages to the user.
   * @state {boolean} isError - Defines whether the message is an error or success.
   * @state {boolean} loading - Indicates whether the form submission is in progress.
   */
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * @function handleSubmit
   * @description Handles the form submission, sending a POST request to the API to trigger the password recovery process.
   * Validates the email input before submission.
   * 
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setIsError(true);
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsError(false);
        setMessage(
          data.message ||
            "If this email exists, we have sent a password reset link."
        );

        // ⏳ Automatically redirect after success
        setTimeout(() => {
          navigate("/LoginPage");
        }, 3000);
      } else {
        setIsError(true);
        setMessage(data.message || data.error || "Error sending email.");
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4 py-24">
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Recover Password
          </h2>

          <p className="text-gray-300 text-sm mb-6 text-center leading-relaxed">
            Enter your email address and we will send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {message && (
              <p
                className={`text-sm text-center ${
                  isError ? "text-red-400" : "text-green-400"
                }`}
                role="alert"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                  Sending link...
                </>
              ) : (
                "Send Link"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
