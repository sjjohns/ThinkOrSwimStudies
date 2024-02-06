#
# Copyright 2014 Scott J. Johnson (https://scottjjohnson.com)
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
# BuyableGapUpIndicator
# 
# Based on Gil Morales and Chris Kacher's rules for buyable gaps up. 
# http://www.traderplanet.com/articles/view/164232-gain-your-stock-edge-buyable-gap-up-strategy/
#
# This study doesn't work intraday because the volume used is the actual volume 
# and not the projected end-of-day volume.  Instead, this study is useful 
# in post-analysis to quickly find buyable gaps up.  
#
# TODO: Add logic to handle the current period gaps up by projecting the full day volume
# based on the current time and volume so far.
#
input AverageTrueRangeTimePeriod = 40;
input BuyableGapPercentOfATR = 75; # percent of average true range to qualify for as a gap
input AverageVolumeTimePeriod = 50; # calculate 50 day MA volume
input BuyableGapUpMinVolumePercent = 150;  # 150% of 50 day MA volume

def AverageTrueRange = reference ATR(AverageTrueRangeTimePeriod, averageType = AverageType.SIMPLE);
def OpeningPriceGap = open - high[1];

def AverageVolume = MovingAverage(AverageType.SIMPLE, volume, AverageVolumeTimePeriod );

def GapUp = (OpeningPriceGap >= AverageTrueRange * BuyableGapPercentOfATR / 100) and (volume > AverageVolume * BuyableGapUpMinVolumePercent / 100);

AddChartBubble(GapUp > 0, low, “G", Color.GREEN, no);

