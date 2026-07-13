import React from 'react'
import PsuedoTable from '../../../reusables/PsuedoTable';
import { getTourTimeline } from '../../../utils/utils';

const TourVisitSequence = (props) => {
  const {place} = props;
  // console.log('place in tvs',place);
  const data = getTourTimeline(place);
  return (
    <>
    <PsuedoTable data={data}/>
    </>
  )
}

export default TourVisitSequence;