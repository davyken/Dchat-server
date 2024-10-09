import React, { useState } from "react";
import Auth from "../../pages/landingPage/Auth";
import { Link } from "react-router-dom";
import { XIcon } from "@heroicons/react/outline";

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  return (
    <div className="bg-white-100 text-gray-900">
      <header className="bg-white py-2 w-full z-10">
        <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
          <h1 className="text-xl font-bold md:text-4xl text-blue-500">D-Chat</h1>
          <nav className="flex-grow mt-2 md:mt-0">
            <div className="flex items-center justify-end">
              <a
                href="#features"
                className="mx-2 text-gray-700 hover:text-blue-500 md:mx-4"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="mx-2 text-gray-700 hover:text-blue-500 md:mx-4"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="mx-2 text-gray-700 hover:text-blue-500 md:mx-4"
              >
                Contact
              </a>
              <button
                onClick={openModal}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 md:ml-4"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      </header>
      <section className="bg-white-500 text-gray-900 py-20 mt-0">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-4">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold md:text-6xl mb-5 leading-relaxed">
              Let's Connect <br /><br />
              with Friends and Family<br /><br />
              in Real Time<br />
            </h1>

            <p className="text-lg mb-6">
              Our app makes it easy to stay in touch with the people who matter
              most in a secure manner and giving the impression of being infront of the person.
            </p>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-gray-200"
            >
              Get Started
            </button>

          </div>
          <div className="md:w-1/2 mt-8 md:mt-1">
            <img
              src="/images/WhatsApp%20Image%202024-09-25%20at%2018.53.05.jpeg"
              alt="D-Chat App Preview"
              className="max-w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="mb-4 text-blue-500">
                  <i className="fas fa-comments fa-2x"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Real-Time Messaging</h3>
                <Link to={"/chatPage"}>
                  <p>
                    Experience instant messaging with our real-time chat
                    feature.
                  </p>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded shadow-md text-center">
                <div className="mb-4 text-blue-500">
                  <i className="fas fa-share-square fa-2x"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Media Sharing</h3>
                <p>
                  Share photos, videos, and voice messages with loved ones
                  easily.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded shadow-md text-center">
                <div className="mb-4 text-blue-500">
                  <i className="fas fa-lock fa-2x"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Secure and Private</h3>
                <p>Your conversations are encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-gray-200 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded shadow-md text-center">
                <p>
                  "This app has changed the way I communicate with my family.
                  It's so easy to use and the features are fantastic!"
                </p>
                <p className="mt-4 text-sm text-gray-600">- Dr John</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded shadow-md text-center">
                <p>
                  "I love the real-time messaging feature. It feels like I'm
                  having a face-to-face conversation."
                </p>
                <p className="mt-4 text-sm text-gray-600">- Officer Chelsy</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded shadow-md text-center">
                <p>
                  "The app is secure and private, which is very important to me.
                  Highly recommend!"
                </p>
                <p className="mt-4 text-sm text-gray-600">- User Davy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-blue-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 D-Chat. All rights reserved.</p>
          <p className="mt-4">
            Contact us:{" "}
            <a href="davykennang552@gmail.com" className="underline">
              support@Davyken.github
            </a>
          </p>
        </div>
      </footer>
      {showModal && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="fixed inset-0 z-40" onClick={closeModal} />{" "}
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md z-50 relative">
            {" "}
            <button
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeModal}
            >
              <XIcon className="h-6 w-6" />
            </button>
            <Auth />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;