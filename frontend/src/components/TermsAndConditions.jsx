import { motion } from 'framer-motion';

const TermsAndConditions = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-yellow-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-700 text-2xl font-bold cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6 text-gray-800">

            {/* Introduction */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h3>
              <p className="leading-relaxed">
                Welcome to BookBee! These Terms and Conditions ("Terms") govern your use of our website and services.
                By accessing or using BookBee, you agree to be bound by these Terms. If you do not agree to these Terms,
                please do not use our service.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>You must provide accurate and complete information when creating your account.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You must be at least 13 years old to use our service.</li>
                <li>You agree to use the service only for lawful purposes and in accordance with these Terms.</li>
              </ul>
            </section>

            {/* Acceptable Use Policy */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Acceptable Use Policy</h3>
              <p className="leading-relaxed mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Post or share illegal, harmful, or offensive content.</li>
                <li>Attempt to hack, disrupt, or gain unauthorized access to our systems.</li>
                <li>Send spam or engage in any form of harassment.</li>
                <li>Violate any applicable laws or regulations.</li>
                <li>Use automated tools to access our service without permission.</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Intellectual Property</h3>
              <p className="leading-relaxed">
                All content, features, and functionality of BookBee, including but not limited to text, graphics,
                logos, and software, are owned by BookBee and are protected by copyright, trademark, and other
                intellectual property laws. You may not reproduce, distribute, or create derivative works without
                our express written permission.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Termination</h3>
              <p className="leading-relaxed">
                We reserve the right to terminate or suspend your account at any time, with or without cause,
                and with or without notice. Upon termination, your right to use the service will cease immediately.
                If you violate these Terms, your account may be terminated permanently.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h3>
              <p className="leading-relaxed">
                BookBee shall not be liable for any indirect, incidental, special, or consequential damages
                arising out of or in connection with your use of the service. Our total liability shall not
                exceed the amount paid by you for the service in the twelve months preceding the claim.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Governing Law</h3>
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of [Your Country/State],
                without regard to its conflict of law provisions. Any disputes arising from these Terms shall be
                resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Information</h3>
              <p className="leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> legal@bookbee.com<br />
                <strong>Address:</strong> [Your Company Address]
              </p>
            </section>

            {/* Last Updated */}
            <section className="border-t pt-4">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> October 25, 2025
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;