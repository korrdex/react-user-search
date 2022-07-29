import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);
  let langue = repos.reduce((acc, curr) => {
    const { language, stargazers_count } = curr;
    if (!language) return acc;
    if (!acc[language]) {
      acc[language] = { label: language, value: 1, starz: stargazers_count };
    } else {
      acc[language] = {
        ...acc[language],
        value: acc[language].value + 1,
        starz: acc[language].starz + stargazers_count,
      };
    }
    return acc;
  }, {});
  let mostUsed = Object.values(langue)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  // starz rating
  let starz = Object.values(langue)
    .sort((a, b) => b.starz - a.starz)
    .map((item) => {
      return { ...item, value: item.starz };
    })
    .slice(0, 5);

  // stars and forks
  let { stars, forks } = repos.reduce(
    (total, curr) => {
      const { stargazers_count, name, forks } = curr;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    { stars: {}, forks: {} }
  );

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        {/* <ExampleChart data={chartData} />; */}
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={starz} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
