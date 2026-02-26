import { useState } from "react";
import styles from "./Book3D.module.css";

interface Book3DProps {
  coverImage: string;
  title: string;
  author: string;
  spineColor?: string;
  delay?: number;
}

const Book3D = ({ 
  coverImage, 
  title, 
  author, 
  spineColor = "hsl(25, 45%, 25%)", 
  delay = 0 
}: Book3DProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={styles.book}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* 3D Book */}
      <div
        className={styles.book__container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`${styles.book__inner} ${isHovered ? styles['book__inner--hovered'] : ''}`}
        >
          {/* Front Cover */}
          <div className={styles.book__front}>
            <img
              src={coverImage}
              alt={title}
              className={styles.book__frontImage}
            />
            {/* Shine effect */}
            <div
              className={`${styles.book__shine} ${isHovered ? styles['book__shine--hovered'] : ''}`}
            />
          </div>

          {/* Spine */}
          <div
            className={styles.book__spine}
            style={{ background: `linear-gradient(90deg, ${spineColor}, ${spineColor}dd)` }}
          >
            <div className={styles.book__spineContent}>
              <span className={styles.book__spineText}>
                {title}
              </span>
            </div>
          </div>

          {/* Back Cover */}
          <div
            className={styles.book__back}
            style={{ background: spineColor }}
          />

          {/* Top edge (pages) */}
          <div className={styles.book__top} />

          {/* Bottom edge (pages) */}
          <div className={styles.book__bottom} />

          {/* Right edge (pages) */}
          <div className={styles.book__right}>
            <div className={styles.book__pages}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className={styles.book__pageLine} />
              ))}
            </div>
          </div>

          {/* Shadow underneath */}
          <div
            className={`${styles.book__shadow} ${isHovered ? styles['book__shadow--hovered'] : ''}`}
          />
        </div>
      </div>

      {/* Book info */}
      <div className={styles.book__info}>
        <h3 className={styles.book__title}>{title}</h3>
        <p className={styles.book__author}>{author}</p>
      </div>
    </div>
  );
};

export default Book3D;