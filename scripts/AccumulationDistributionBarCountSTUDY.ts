#
# Copyright 2014 Scott J. Johnson (http://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#
# AccumulationDistributionBarCount
#
# Counts the instances of accumulation and distribution in a stock over a 
# period of time.  Based on Mike Scott's presentation at the IBD National Meetup
# in May 2014.
# http://ibdtv.investors.com/national-meetup-events/699580-.aspx
#
# I changed the negative close threshold from 40% (in Mike's presentation) to 
# 38% per a new study from investors.com. 
#
# This study is designed to be applied with the aggregation period of days.
#
declare lower;

input AvgVolumePeriod = 50;

# 50 day average volume
def AvgVolume = Average(volume, AvgVolumePeriod);

# accumulation/distribution count
def BarCountData;
def PriceChange;
def PriceRange;
def RelativeClosePercent;

if (volume > AvgVolume) {
    PriceChange = close - close[1];
    PriceRange = high - low;
    RelativeClosePercent = (close - low) / PriceRange;

    if (PriceChange > 0) {  # positive close
        if (RelativeClosePercent >= 0.50) {  # close in upper half of range is accumulation
            BarCountData = 1;
        } else if (RelativeClosePercent < 0.50) {  # close in lower half of range is stalling
            BarCountData = -1;
        } else {
            BarCountData = 0;
        }
    } else if (PriceChange < 0)  {   # negative close
        if (RelativeClosePercent < 0.38) {  # close in lower 38% of range is distribution
            BarCountData = -1;
        } else {
            BarCountData = 0;   # ignore support day down, but in upper 62% of bar
        }
    } else {
        BarCountData = 0;
    }
} else {
    PriceChange = 0;
    PriceRange = 0;
    RelativeClosePercent = 0;

    BarCountData = 0;
}

# Plot the tick marks showing individual instances of accumulation or distribution
plot BarCountPlot = BarCountData;
BarCountPlot.setPaintingStrategy(PaintingStrategy.HISTOGRAM);
def LineColor = if(BarCountData > 0.0, 16, if(BarCountData < 0.0, 5, 17));
BarCountPlot.AssignValueColor(getColor(LineColor));

# Plot of the sum of a/d instances since the beginning of the chart
plot BarSumPlot = TotalSum(BarCountPlot);
BarSumPlot.SetDefaultColor(Color.YELLOW);
BarSumPlot.setLineWeight(2);

# Plot of the reference line where the net a/d count is zero.
plot ZeroLine = 0;
ZeroLine.SetDefaultColor(Color.WHITE);
