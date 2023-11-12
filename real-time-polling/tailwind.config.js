module.exports = {
        content: ["./src/**/*.{js,jsx,ts,tsx}"],
        theme: {
          extend: {
            colors: {
              
            },
            fontFamily: {
            
            },
            fontSize: {
              'xs': ['0.75rem', '1rem'],     // Example: Extra small screens
              'sm': ['0.875rem', '1.25rem'],  // Example: Small screens
              'base': ['1rem', '1.5rem'],     // Example: Medium screens
              'lg': ['1.125rem', '1.75rem'],  // Example: Large screens
              'xl': ['1.25rem', '2rem'],      // Example: Extra large screens
              '2xl': ['1.5rem', '2.25rem'],    // Example: 2X large screens
              '3xl': ['1.875rem', '2.5rem'],   // Example: 3X large screens
              '4xl': ['2.25rem', '3rem'],      // Example: 4X large screens
              '5xl': ['3rem', '1'],            // Example: 5X large screens
              '6xl': ['4rem', '1'],
            },
            container: {
              center: true,
              padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
              },
            },
          },
        },
        plugins: [],
      };