import React from "react";
import Link from "next/link";
import {
  Heart,
  GitHub,
  Twitter,
  Mail,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
} from "lucide-react";
import {
  FaGithub,
  FaTwitter,
  FaMailBulk,
  FaHeart,
  FaWhatsapp,
  FaLinkedinIn,
  FaXbox,
  FaVoicemail,
} from "react-icons/fa"; // FontAwesome icons

export default function Footer() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <p className="flex items-center text-gray-600">
        Made with <FaHeart className="text-red-500 mx-1" size={16} /> by
        Stephanie Udemezue
      </p>
      <p className="p-0 text-gray-600">
        <p>Get in touch with me and send feedback/reviews</p>
      </p>
      <div className="flex space-x-4 pb-4">
        <Link
          href="https://github.com/yourusername"
          className="text-gray-600 hover:text-purple-600 transition-colors"
        >
          <FaGithub size={20} />
        </Link>
        <Link
          href="udemezuestephanie6@gmail.com"
          className="text-gray-600 hover:text-purple-600 transition-colors"
        >
          <Mail size={20} />
        </Link>
        <Link
          href="https://www.linkedin.com/in/stephanie-udemezue/"
          className="text-gray-600 hover:text-purple-600 transition-colors"
        >
          <FaLinkedinIn size={20} />
        </Link>

        <Link
          href="https://wa.me/qr/K35CYZRN2Z5GE1"
          className="text-gray-600 hover:text-purple-600 transition-colors"
        >
          <FaWhatsapp size={20} />
        </Link>
      </div>
    </div>
  );
}
