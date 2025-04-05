import React from 'react';
import BlogPostPageTemplate from '@/components/templates/BlogPostPageTemplate';

const postData = {
  title: "Company Update: Welcoming New Team Members",
  author: "QuantumHive HR",
  publicationDate: "February 20, 2025",
  featuredImageUrl: "https://via.placeholder.com/800x400/fafad2/b22222?text=Welcome+Team!",
  content: `
    <p>We are thrilled to announce the expansion of the QuantumHive team! As we continue to grow and tackle exciting new challenges, we've brought on board several talented individuals who share our passion for innovation and excellence.</p>
    <h2>Meet Our Newest Members</h2>
    <p>Please join us in welcoming:</p>
    <ul>
      <li><strong>Eva Martinez (Senior Software Engineer):</strong> With over 8 years of experience in full-stack development and cloud architecture, Eva brings a wealth of knowledge to our engineering team.</li>
      <li><strong>Frank Green (UX/UI Designer):</strong> Frank has a keen eye for detail and a passion for creating intuitive and engaging user experiences. He'll be instrumental in shaping the look and feel of our client projects.</li>
      <li><strong>Grace Hall (Project Manager):</strong> Grace joins us with a strong background in managing complex software projects, ensuring timely delivery and clear communication.</li>
    </ul>
    <p>Their expertise and enthusiasm are already making a positive impact. We're excited about the contributions they will make to our team and our clients.</p>
    <p>Welcome aboard, Eva, Frank, and Grace!</p>
  `, // Using string with basic HTML
  tags: ["Company News", "Team", "Hiring"],
};

export default function CompanyUpdateNewHiresPage() {
  return <BlogPostPageTemplate post={postData} />;
}