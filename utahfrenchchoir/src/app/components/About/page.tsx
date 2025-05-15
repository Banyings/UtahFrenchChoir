// About Us Page
'use client'
import Image from "next/image";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  "/choir-group.png",
  "/malau.png"
];

export default function About() {
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 text-gray-800">
      <section className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-gray-900">Direction</h2>
        <p className="text-lg">Choir President: <span className="font-medium">Francis Badibanga</span></p>
        <p className="text-lg">Music Directors: Serge Nkakonde, Joli Haboko, Benjamin Lukonga</p>
        <p className="text-lg">Assistants: Sue Winmill, Jenny</p>
        <p className="text-lg">Developers and Technicians: Hyppolite Banyingela, Bernadi Kola, Eriel Nyengo</p>
        <p className="text-lg">Pianists: Arthur Lono, Huggens Tshibanda</p>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-gray-900">Choir Members</h2>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          Our members come from the Democratic Republic of the Congo, Canada, the United States, Ivory Coast, and France.
          We sing primarily in French but can perform in Tshiluba, Swahili, English, and other languages.
        </p>
      </section>

      <section className="relative w-full max-w-2xl mx-auto">
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg"
          aria-label="Previous Image"
        >
          <FaChevronLeft />
        </button>

        <Image
          src={images[currentImage]}
          alt="Choir"
          width={800}
          height={500}
          className="rounded-lg mx-auto shadow-lg transition duration-300"
        />

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg"
          aria-label="Next Image"
        >
          <FaChevronRight />
        </button>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-gray-900">History of Utah French Choir</h2>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          We began singing in an apartment building in 2018 to praise God, with no initial intention of performing publicly.
          A year later, we started sharing our passion more widely.
          <br />
          <a href="/components/Blog" className="text-blue-600 font-semibold underline hover:text-blue-800">Visit our blog</a> to learn more.
        </p>
      </section>
    </div>
  );
}
