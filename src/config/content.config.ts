export const contentConfig = {
  // Hero Section
  hero: {
    title: {
      line1: 'PERSONALIZED',
      line2: 'STONE BRACELET',
    },
    subtitle: {
      thai: 'กำไลหินเฉพาะบุคคล',
      english: 'เปลี่ยนแปลงชีวิตในระดับจิตวิญญาณด้วยศาสตร์ร้อยหินเฉพาะตัว',
    },
    cta: {
      text: 'สั่งออกแบบ',
      variant: 'gold' as const,
      highlight: true,
    },
    background: {
      image:
        'https://static.wixstatic.com/media/357c3a_d5bbbe07a2cb43579ad4d33c6279ff5a~mv2.jpg/v1/fill/w_1265,h_1328,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/357c3a_d5bbbe07a2cb43579ad4d33c6279ff5a~mv2.jpg',
      alt: 'Stone bracelets background',
    },
  },

  // About Section
  about: {
    title: "More Than Value, it's Spiritual Worth",
    subtitle: '"มากกว่าคุณค่าทางใจคือคุณค่าทางจิตวิญญาณ"',
    content: {
      thai: 'ร้อยหิน คือสถานที่สร้างศิลปะแห่งสายหินที่ให้ความหมายเฉพาะตัวคุณ ด้วยการผสมผสานศาสตร์โบราณและความเข้าใจสมัยใหม่ เรานำหินธรรมชาติที่มีพลังแห่งการบำบัดมาร้อยเรียงอย่างพิถีพิถัน เพื่อสร้างเครื่องประดับที่ไม่เพียงสวยงาม แต่ยังช่วยเสริมสร้างพลังชีวิตให้กับผู้สวมใส่',
      english:
        'ROIHIN is a place where stone artistry is created with personal meaning for you. By combining ancient wisdom with modern understanding, we carefully string natural stones with healing powers to create jewelry that is not only beautiful but also enhances the life force of the wearer.',
    },
    cta: {
      text: 'เรียนรู้เพิ่มเติม',
      variant: 'primary' as const,
    },
  },

  // Signature Charm Section
  signatureCharm: {
    title: 'SIGNATURE CHARM',
    subtitle:
      'ชาร์มเอกลักษณ์ของร้อยหิน ออกแบบด้วยความประณีตและใส่ใจในทุกรายละเอียด แต่ละชิ้นถูกสร้างขึ้นเพื่อเสริมพลังให้กับสายหินของคุณ ด้วยสัญลักษณ์ที่มีความหมายลึกซึ้งและพลังงานเฉพาะตัว',
    cta: {
      text: 'ดูชาร์มเพิ่มเติม',
      variant: 'primary' as const,
    },
    background: {
      image: '/images/357c3a_2013cc64ddf74b35b6a0d668ae5effb8~mv2.avif',
      alt: 'Signature charm background',
    },
  },

  // Testimonials Section
  testimonials: {
    title: 'TESTIMONIALS',
    subtitle: 'เสียงตอบรับจากผู้ใช้จริง',
    items: [
      {
        id: '1',
        content: `"เป็นลูกค้าร้านหินของน้องซันมารุ่นแรกๆเลยค่ะ ขอชมจากใจเลยว่างานหินที่น้องเค้าทำออกมาทุกเส้นเป็นงานที่ทำด้วยความตั้งใจ ความเอาใจใส่ ทำให้หินทุกเม็ดที่ร้อยมีคุณค่า สัมผัสได้ถึงพลังงานของความรัก ความอ่อนโยน และไปจนถึงความปรารถนาดีจากผู้ทำที่ส่งต่อผ่านหินมายังผู้ที่เป็นเจ้าของ หินทุกเม็ดที่สมบูรณ์แบบอยู่ที่นี่ มาหาได้ที่ร้อยหินค่ะ" - Ariya Nrd`,
      },
      {
        id: '2',
        content: `"11 กุมภาฯนี้ ก็จะครบ2ปีเต็มที่ใช้บริการกับร้อยหินค่ะ  อยากจะบอกว่า โดยส่วนตัวเป็นคนชอบเรื่องหินอยู่แล้วค่ะ แต่สำหรับร้านร้อยหิน เส้นเดียวไม่เคยพอจริงๆ เพราะได้รับพลังงานดีๆจากหิน ใส่แล้วเย็นกายสบายใจ ซื้อหินร้านนี้ไม่ใช่แค่ได้หินมาเท่านั้น แต่ได้รับการบริการและคำแนะนำในการจัดเรียงหินให้เหมาะกับเราและงบที่เรามี ไม่มีการบังคับซื้อ เหมือนกับหินเลือกเจ้าของ ประทับใจมากๆเลยค่ะ คอยตามไลฟ์สดของคุณซันอยู่นะคะ" - Ranyapat J.`,
      },
    ],
    cta: {
      text: 'อ่านเพิ่มเติม',
      variant: 'primary' as const,
      href: '/testimonial',
    },
  },

  // Gallery Section
  gallery: {
    title: 'INSPIRED ROIHIN',
    subtitle: 'แรงบันดาลใจ ขับเคลื่อนพลังงานนอกกฎเกณฑ์',
    ctaButtons: [
      {
        text: 'ออกแบบด้วยตัวเอง',
        variant: 'gold' as const,
        highlight: true,
      },
      {
        text: 'ออกแบบโดยร้อยหิน',
        variant: 'primary' as const,
      },
    ],
    background: {
      image:
        'https://static.wixstatic.com/media/357c3a_449b1b790747456cb742616cdedb4af0~mv2.png/v1/fill/w_1265,h_834,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/357c3a_449b1b790747456cb742616cdedb4af0~mv2.png',
      alt: 'Gallery background',
    },
  },

  // Vibrant Destiny Section
  vibrantDestiny: {
    title: 'VIBRANT YOUR DESTINY',
    subtitle: 'ROIHIN STONE AND BRACELET, THAILAND',
    since: 'SINCE 2021',
    background: {
      image: '/images/357c3a_155e041dcebb4320b8cb23202c8441e8~mv2.avif',
      alt: 'Vibrant your destiny background',
    },
  },

  // About Page Content
  aboutPage: {
    hero: {
      backgroundImage: '/images/357c3a_39f0c2c0d57f4da1a70dee7117de782f~mv2.jpg', // Cover.jpg equivalent
      title: {
        line1: 'WE AIM TO',
        line2: 'VIBRANT YOUR DESTINY',
        line3: 'AMONG LIFE',
      },
    },
    aboutSection: {
      title: {
        english: 'About',
        thai: 'ROIHIN',
      },
      subtitle: {
        thai: 'พลังแห่งการสั่นไหวในระดับจิตวิญญาณ',
      },
      content: {
        english: [
          'ROIHIN Stone and Bracelet is the art of connecting natural elemental energy, spirit, and desires. It involves connecting gemstones to create narratives that reflect energy, resulting in transformations for those who possess them.',
          'Natural elements possess powerful energies that can continuously create vibrations both externally and internally. When connected with care by experts, these energies can enhance your destiny, turning misfortune into opportunity, like unlocking a door to rapid success.',
          'We adhere to ethical principles and embrace the philosophy of nature to cultivate wisdom in living virtuously. We share our knowledge to foster positive changes, both physically and spiritually.',
          "Let go of ego, open your heart, and explore energies you've never experienced before. We believe that this connection brings us together in meaningful ways. . . .",
        ],
        thai: [
          'ร้อยหินคือศาสตร์แห่งการเชื่อมโยงพลังงานธาตุธรรมชาติ จิตวิญญาณและความปรารถนาเข้าด้วยกัน ถือเป็นศาสตร์แห่งการร้อยเรียงอัญมณีธาตุให้เกิดเป็นเรื่องราว เพื่อสะท้อนพลังงานให้เกิดการสั่นไหวและให้ผลลัพท์แห่งการเปลี่ยนแปลงกับผู้ที่ได้ครอบครอง',
          'ธาตุธรรมชาติย่อมมีพลังมาก สามารถสร้างแรงสั่นสะเทือนทั้งภายนอกและภายในได้อย่างต่อเนื่อง หากได้รับการเชื่อมโยงพลังงานโดยผู้เชี่ยวชาญอย่างพิถีพิถันแล้ว พลังงานที่เหมาะสมจะช่วยกระตุ้นหนุนดวงชะตา พลิกร้ายกลายเป็นดี ดั่งกุญแจปลดล็อคที่ช่วยให้คุณเปิดโลกสู่ความสำเร็จได้อย่างรวดเร็ว',
          'เรายึดถือคุณธรรม ยึดมั่นในศีลธรรม สั่งสมปรัชญาแห่งธรรมชาติเพื่อก่อเกิดปัญญาในการใช้ชีวิตอย่างมีจรรยา เราถ่ายทอดแบ่งปันสู่เพื่อนพ้องเพื่อให้เกิดการเปลี่ยนแปลงที่ดีกว่า ทั้งในด้านกายภาพและลึกซึ่งในระดับจิตวิญญาณ',
          'จงวางอัตตาลงเถิด เปิดหัวใจให้กว้างและลองเรียนรู้สัมผัสกับพลังงานที่ไม่อาจเคยได้สัมผัสจากที่ไหนมาก่อน เราเชื่อว่าสาสนาสัมพันธ์ ทำให้เราได้เจอกัน . . .',
        ],
      },
    },
    features: [
      {
        id: 'unique-design',
        image: '/images/357c3a_c78543e690504fdd80ac15754320656b~mv2.avif', // IMG_7665.jpeg equivalent
        title: {
          english: 'Unique Design',
          thai: 'รูปแบบอันเป็นอัตลักษณ์เฉพาะ',
        },
      },
      {
        id: 'natural-purifying',
        image: '/images/357c3a_2013cc64ddf74b35b6a0d668ae5effb8~mv2.avif', // IMG_5343.JPG equivalent
        title: {
          english: 'Natural Purifying',
          thai: 'บริสุทธิ์ด้วยพลังธรรมชาติ',
        },
      },
      {
        id: 'premium-care',
        image: '/images/357c3a_449b1b790747456cb742616cdedb4af0~mv2.avif', // LINE_ALBUM equivalent
        title: {
          english: 'Premium Care',
          thai: 'รักษาด้วยบรรจุภัณฑ์คุณภาพ',
        },
      },
      {
        id: 'empowering-ritual',
        image: '/images/357c3a_155e041dcebb4320b8cb23202c8441e8~mv2.avif', // 01011500-01.jpeg equivalent
        title: {
          english: 'Empowering Ritual',
          thai: 'ปลุกพลังด้วยพิธีกรรมขั้นสูง',
        },
      },
    ],
  },

  // Blog Page Content
  blog: {
    hero: {
      backgroundImage: '/images/357c3a_c78543e690504fdd80ac15754320656b~mv2.avif',
      title: {
        english: 'STONE WISDOM',
        thai: 'BLOG',
      },
      subtitle: {
        thai: 'ความรู้และเรื่องราวแห่งพลังหิน',
        english: 'Discover the ancient wisdom and modern insights of natural stone healing',
      },
    },
    postsSection: {
      title: {
        english: 'Latest Articles',
        thai: 'บทความล่าสุด',
      },
      subtitle: {
        thai: 'เรียนรู้และสำรวจโลกแห่งพลังงานหิน',
        english: 'Learn and explore the world of stone energy',
      },
      posts: [
        {
          id: 'understanding-stone-energy',
          title: {
            english: 'Understanding Stone Energy',
            thai: 'ทำความเข้าใจพลังงานหิน',
          },
          excerpt: {
            english: 'Discover how natural stones carry unique vibrational frequencies that can influence our energy fields and promote healing.',
            thai: 'ค้นพบว่าหินธรรมชาติมีความถี่การสั่นไหวที่เป็นเอกลักษณ์ที่สามารถส่งผลต่อสนามพลังงานของเราและส่งเสริมการรักษา',
          },
          image: '/images/357c3a_2013cc64ddf74b35b6a0d668ae5effb8~mv2.avif',
          date: '2024-01-15',
          readTime: 5,
          category: {
            english: 'Stone Knowledge',
            thai: 'ความรู้เรื่องหิน',
          },
        },
        {
          id: 'choosing-right-stones',
          title: {
            english: 'Choosing the Right Stones for Your Journey',
            thai: 'การเลือกหินที่เหมาะสมกับการเดินทางของคุณ',
          },
          excerpt: {
            english: 'Learn how to select stones that align with your personal energy and life goals for maximum spiritual benefit.',
            thai: 'เรียนรู้วิธีการเลือกหินที่สอดคล้องกับพลังงานส่วนตัวและเป้าหมายชีวิตของคุณเพื่อประโยชน์ทางจิตวิญญาณสูงสุด',
          },
          image: '/images/357c3a_449b1b790747456cb742616cdedb4af0~mv2.avif',
          date: '2024-01-10',
          readTime: 7,
          category: {
            english: 'Stone Knowledge',
            thai: 'ความรู้เรื่องหิน',
          },
        },
        {
          id: 'stone-care-cleansing',
          title: {
            english: 'Stone Care and Cleansing Rituals',
            thai: 'การดูแลและพิธีกรรมชำระล้างหิน',
          },
          excerpt: {
            english: 'Proper maintenance and cleansing techniques to keep your stones energetically pure and powerful.',
            thai: 'เทคนิคการบำรุงรักษาและชำระล้างที่เหมาะสมเพื่อให้หินของคุณบริสุทธิ์และทรงพลังในด้านพลังงาน',
          },
          image: '/images/357c3a_155e041dcebb4320b8cb23202c8441e8~mv2.avif',
          date: '2024-01-05',
          readTime: 6,
          category: {
            english: 'Stone Care Tips',
            thai: 'เคล็ดลับดูแลหินพลังงาน',
          },
        },
        {
          id: 'meditation-with-stones',
          title: {
            english: 'Meditation Practices with Sacred Stones',
            thai: 'การฝึกสมาธิด้วยหินศักดิ์สิทธิ์',
          },
          excerpt: {
            english: 'Enhance your meditation practice by incorporating the healing energies of carefully selected stones.',
            thai: 'เสริมสร้างการฝึกสมาธิของคุณโดยการรวมพลังงานการรักษาของหินที่คัดสรรมาอย่างดี',
          },
          image: '/images/357c3a_c78543e690504fdd80ac15754320656b~mv2.avif',
          date: '2023-12-28',
          readTime: 8,
          category: {
            english: 'Stone Knowledge',
            thai: 'ความรู้เรื่องหิน',
          },
        },
        {
          id: 'seasonal-stone-guide',
          title: {
            english: 'Seasonal Stone Guide: Aligning with Natural Cycles',
            thai: 'คู่มือหินตามฤดูกาล: การปรับตัวให้เข้ากับรอบธรรมชาติ',
          },
          excerpt: {
            english: 'Discover which stones work best during different seasons and how to harness seasonal energies.',
            thai: 'ค้นพบว่าหินใดเหมาะสมที่สุดในแต่ละฤดูกาลและวิธีการใช้ประโยชน์จากพลังงานตามฤดูกาล',
          },
          image: '/images/357c3a_2013cc64ddf74b35b6a0d668ae5effb8~mv2.avif',
          date: '2023-12-20',
          readTime: 9,
          category: {
            english: 'Stone Knowledge',
            thai: 'ความรู้เรื่องหิน',
          },
        },
        {
          id: 'chakra-stone-healing',
          title: {
            english: 'Chakra Healing with Specific Stones',
            thai: 'การรักษาจักระด้วยหินเฉพาะ',
          },
          excerpt: {
            english: 'Learn which stones correspond to each chakra and how to use them for energy balance and healing.',
            thai: 'เรียนรู้ว่าหินใดสอดคล้องกับแต่ละจักระและวิธีการใช้เพื่อสมดุลพลังงานและการรักษา',
          },
          image: '/images/357c3a_449b1b790747456cb742616cdedb4af0~mv2.avif',
          date: '2023-12-15',
          readTime: 10,
          category: {
            english: 'Stone Knowledge',
            thai: 'ความรู้เรื่องหิน',
          },
        },
      ],
      loadMoreButton: {
        text: {
          english: 'Load More Articles',
          thai: 'โหลดบทความเพิ่มเติม',
        },
        variant: 'primary' as const,
      },
    },
    categories: [
      {
        id: 'all',
        name: {
          english: 'All Articles',
          thai: 'บทความทั้งหมด',
        },
      },
      {
        id: 'stone-knowledge',
        name: {
          english: 'Stone Knowledge',
          thai: 'ความรู้เรื่องหิน',
        },
      },
      {
        id: 'stone-care-tips',
        name: {
          english: 'Stone Care Tips',
          thai: 'เคล็ดลับดูแลหินพลังงาน',
        },
      },
    ],
  },
}
