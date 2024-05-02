<style>
.graph-container {
  width: 100%;
  height: 0;
  padding-top: 75%; /* 100% / (4 / 3) = 75% */
  position: relative;
}

:global(.graph-container > svg) {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
<script>
  import { onMount, afterUpdate } from 'svelte';
import Graph from './Graph.svelte';

  let data = [
    {
      "year": "CY2021",
      "totalOrders": 430,
      "totalTargets": 376
    },
    {
      "year": "CY2022",
      "totalOrders": 337,
      "totalTargets": 417
    },
    {
      "year": "CY2023",
      "totalOrders": 352,
      "totalTargets": 759
    }
  ];
  let splineViewerLoaded = false;
  let text = `

The Foreign Intelligence Surveillance Act (FISA) was established in 1978 in response to public outcry over revelations of domestic spying abuses by the U.S. government during the Nixon era. As a cornerstone of national security law, FISA sets forth procedures for the physical and electronic surveillance and collection of "foreign intelligence information" between or among "foreign powers" and agents of foreign powers suspected of espionage or terrorism. This act represents an attempt to balance the need for national security with the protection of privacy and civil liberties. Over the decades, FISA has been amended multiple times to adapt to the evolving landscape of global communication technology and international threats, prompting ongoing debates about its implications for privacy and security.

## FISA Overview

FISA was initially focused on electronic surveillance but has since been expanded through amendments to cover other intelligence-gathering methods, such as physical searches and the collection of business records. Since the September 11 attacks, the law has been amended multiple times, often amidst controversy over privacy issues.

The law led to the creation of the Foreign Intelligence Surveillance Court (FISC), which oversees requests for surveillance warrants. The court operates in secret, making decisions based on evidence presented solely by the Department of Justice. Although it primarily handles applications confidentially, significant decisions and interpretations of law are required to be declassified to the extent practicable.

FISA permits two types of surveillance activities: those conducted with a court order and those without. Surveillance without a court order can be authorized directly by the President for up to one year, provided it targets foreign powers or their agents and does not involve a significant likelihood of capturing communications to which a U.S. person is a party. This type of surveillance must adhere to minimization procedures to protect the identities of U.S. persons.

The surveillance that requires a court order involves a rigorous process where the FISC must find probable cause that the target is a foreign power or an agent thereof and that the surveillance is likely to obtain foreign intelligence information. These orders can vary in duration, depending on the target and the type of surveillance.

## Debates and Reforms Surrounding FISA

FISA has been at the center of significant legal and political debates, especially concerning the balance between national security interests and privacy rights. The law was notably highlighted in the media in 2005 when the New York Times exposed a warrantless wiretapping program authorized under the Bush Administration post-9/11, which led to public and political uproar. Subsequent legislation, such as the Protect America Act of 2007 and the FISA Amendments Act of 2008, sought to address and legalize aspects of the program under court oversight, introducing measures such as the controversial Section 702. This section allows for the mass collection of foreign communications without a warrant, which can also incidentally collect communications involving Americans.

Critics argue that FISA's broad provisions and the secretive nature of the court's proceedings pose risks to civil liberties, suggesting that the law could be used to justify extensive government overreach. Proponents, however, believe that FISA is crucial for protecting national security and has adequate safeguards to prevent abuse.

Recent discussions and reforms have focused on enhancing oversight and transparency, such as the USA Freedom Act of 2015, which introduced changes intended to limit bulk data collection and increase transparency of the FISC proceedings. The act also aimed to provide a more balanced approach to surveillance, requiring more specific procedures for the collection of telephony and internet metadata.

#### "As of today, I don’t accept the claim that Americans’ privacy is adequately protected under the current 702 program." 

In 2017, the FISA Amendments Reauthorization Act extended Section 702 for six years, incorporating new measures intended to safeguard civil liberties while maintaining essential surveillance capabilities. This reauthorization continued to spark debate over the sufficiency of the reforms and the appropriateness of the surveillance powers granted under FISA.

As of 2023, discussions about further reauthorization of Section 702 have included debates over the need for more significant reforms to ensure privacy protections, reflecting ongoing tension between national security needs and individual rights. This includes calls from various political and advocacy groups for changes that would further restrict surveillance authorities and enhance accountability mechanisms.

## Modern Challenges and Debates on Section 702 Renewal

The Biden administration has actively engaged Congress to renew Section 702 of the Foreign Intelligence Surveillance Act (FISA), a critical element in U.S. intelligence operations that is due to expire at the end of the year. This section allows U.S. intelligence agencies to collect vast amounts of foreign communications without a warrant, a capability that officials argue is essential for national security.

This surveillance tool has been instrumental in various significant operations, including preventing ransomware attacks on critical infrastructure, disrupting terrorist activities, and contributing to high-profile operations such as the elimination of al-Qaida leader Ayman al-Zawahri. Despite these successes, the program faces substantial scrutiny due to the incidental collection of communications involving Americans, raising serious privacy concerns.

The debate on Capitol Hill is expected to be contentious, with an unusual coalition of civil liberties advocates and some Republicans expressing skepticism about the renewal of these powers. Critics, including Senator Ron Wyden, argue that the current safeguards are insufficient to protect Americans' privacy. "As of today, I don’t accept the claim that Americans’ privacy is adequately protected under the current 702 program," Wyden stated, emphasizing the need for more transparency regarding how often the incidental collection data is searched for information about Americans.

The political climate is particularly charged, as recent controversies, such as the FBI's handling of surveillance during the investigation into Russian interference in the 2016 election, have led to increased skepticism about the government's surveillance capabilities. This skepticism is shared by some Republicans who see the authority under Section 702 as ripe for abuse and overreach.

Amidst these debates, the Biden administration is making concerted efforts to highlight the value of Section 702. High-level officials, including the national security adviser and the attorney general, have been vocal about the necessity of this program, emphasizing that it underpins the U.S. ability to stay ahead of adversaries in an increasingly complex global security environment.

Despite the controversies, national security officials and some lawmakers stress the critical nature of the program. They argue that allowing Section 702 to lapse could significantly weaken U.S. intelligence capabilities at a time when cybersecurity threats and international tensions are escalating.

  `;

let references = [
    {id: 1, text: 'Wikipedia. (n.d.). "Foreign Intelligence Surveillance Act." Retrieved May 2, 2024, from', link: "https://en.wikipedia.org/wiki/Foreign_Intelligence_Surveillance_Act"},
    {id: 2, text: 'Tucker, Eric, and Nomaan Merchant. 2023. "US officials make case for renewing FISA surveillance powers." AP News. Published February 28, 2023, 2:53 PM EDT. Retrieved May 2, 2024.', link: "https://apnews.com/article/fisa-surveillance-intelligence-espionage-terrorism-congress-80f88dde705d578f7535ae167d90a90d"},
    {id: 3, text: "Office of the Director of National Intelligence. (2024). 2023 Annual Statistical Transparency Report Regarding Use of National Security Surveillance Authorities. Office of the Director of National Intelligence", link: "https://www.dni.gov/index.php/newsroom/reports-publications/reports-publications-2024/3811-annual-statistical-transparency-report-regarding-national-security-authorities-calendar-year-2023"},
    // Add more references as needed
  ];
let paragraphs = text.split('\n').filter(Boolean).map(paragraph => {
  if (paragraph.startsWith('## ')) {
    return { subheader: paragraph.slice(3), text: null, h4: null };
  } else if (paragraph.startsWith('#### ')) {
    return { subheader: null, text: null, h4: paragraph.slice(5) };
  } else {
    return { subheader: null, text: paragraph, h4: null };
  }
});
  onMount(() => {
    console.log("Component mounted, adding load event listener to spline-viewer");
    const intervalId = setInterval(() => {
      const splineViewer = document.querySelector('spline-viewer');
      if (splineViewer) {
        console.log("spline-viewer found", splineViewer);
        clearInterval(intervalId);
        handleLoad();
      }
    }, 1000);
  });

  function handleLoad() {
    console.log("spline-viewer has loaded");
    splineViewerLoaded = true;
  }
let textContainer;

$: if (splineViewerLoaded) {
  console.log("splineViewerLoaded updated: ", splineViewerLoaded);
  const splineViewer = document.querySelector('spline-viewer');
  const shadowRoot = splineViewer.shadowRoot;
  const canvas = shadowRoot.querySelector('canvas');
  if (canvas) {
    console.log("Canvas found");
    canvas.style.width = '100vw';
    canvas.style.height = 'auto';
    canvas.style.position = 'relative'; // Position the element
    canvas.style.zIndex = '1'; // Set the z-index

    // Check if the textContainer already exists
    if (!textContainer) {
      // Create a new div for the text container
      textContainer = document.createElement('div');
      textContainer.style.position = 'absolute';
      textContainer.style.top = '1%';
      textContainer.style.left = '0';
      textContainer.style.right = '0';
      textContainer.style.marginLeft = 'auto';
      textContainer.style.marginRight = 'auto';
      textContainer.style.width = '50%';
      textContainer.style.display = 'flex';
      textContainer.style.flexDirection = 'column';
      textContainer.style.justifyContent = 'center';
      textContainer.style.alignItems = 'center';
         textContainer.style.textAlign = 'center'; // Center align the text


      // Create h1 and h2 elements
      const h1 = document.createElement('h1');
      h1.textContent = 'Foreign Intelligence Surveillance Act';
      h1.style.color = 'white';
      h1.style.fontSize = '5vw'; // Set h1 font size
      h1.style.fontFamily = 'neue-haas-grotesk-display, sans-serif';
      h1.style.fontStyle = 'normal';
      h1.style.fontWeight = '900';
      h1.style.margin = '.5rem'; // Set bottom margin
      h1.style.lineHeight = '5vw'; // Set line height

    const hr = document.createElement('hr'); // Create a horizontal line
hr.style.borderTop = '.25px solid white'; // Style the horizontal line
hr.style.width = '70%'; // Set the width of the horizontal line

      const h2 = document.createElement('h2');
      h2.textContent = 'The 1978 Law Governing Domestic Surveillance of Foreign Intelligence';
    h2.style.color = 'white'; // Set h2 color
    h2.style.fontSize = '2.8vw'; // Set h2 font size
    h2.style.fontFamily = 'neue-haas-grotesk-display, sans-serif'; // Set h2 font family
    h2.style.fontStyle = 'normal'; // Set h2 font style
    h2.style.fontWeight = '100'; // Set h2 font weight
    h2.style.margin = '.5rem'; // Set all-around margin for h2
    

      // Append h1 and h2 to the text container
      textContainer.appendChild(h1);
      textContainer.appendChild(hr);
      textContainer.appendChild(h2);

      // Append the text container to the shadow root
      shadowRoot.appendChild(textContainer);
    }

    // Update the height of the textContainer to match the canvas height
    textContainer.style.height = canvas.offsetHeight + 'px';
  } else {
    console.log("Canvas not found");
  }
}

// Add an event listener for the window's resize event
window.addEventListener('resize', () => {
  if (textContainer) {
    const splineViewer = document.querySelector('spline-viewer');
    const shadowRoot = splineViewer.shadowRoot;
    const canvas = shadowRoot.querySelector('canvas');
    if (canvas) {
      textContainer.style.height = canvas.offsetHeight + 'px';
    }
  }
});
</script>

<main>
  <spline-viewer url="https://prod.spline.design/OVu3NZWx3GjBVUnn/scene.splinecode" on:load={handleLoad}></spline-viewer>
  <article>
    <div class="author-credits">
      <p>by wikipedia editors</p>
    </div>
    {#each paragraphs as { text, subheader, h4 }, index}
      <section>
        {#if subheader}
          <h3>{subheader}<span class="blinking-dot"></span></h3>
        {/if}
        {#if text}
          <p>{text}</p>
        {/if}
        {#if h4}
          <h4 class="pull-quote">{h4}</h4>
        {/if}
        {#if index === 5} <!-- 0-based index, so 5 is the 6th paragraph -->
          <div class="graph-container">
            <Graph />
          </div>
        {/if}
      </section>
    {/each}
    <section>
      <h5>References</h5>
<ol>
  {#each references as reference}
    <li class="reference-style">
      <span>{reference.text}</span>, <a href={reference.link}>{reference.link}</a>
    </li>
  {/each}
</ol>
    </section>
  </article>
</main>